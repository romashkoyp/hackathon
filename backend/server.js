import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite's default port
    'https://business-assessment-frontend.onrender.com' // Render frontend URL
  ],
  credentials: true
}));
app.use(express.json());

// Initialize Google Generative AI
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

// Test endpoint to verify server is running
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend server is running!', 
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.GOOGLE_API_KEY
  });
});

// Business Questionnaire Assessment endpoint
app.post('/api/questionnaire/assess', async (req, res) => {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({
        error: 'Google API key not found in environment variables'
      });
    }

    const { basicInfo, sdeCalculation, assessmentChecklist } = req.body;

    const prompt = `You are an elite M&A advisor and business valuation specialist with deep expertise in Finnish SME markets, particularly for businesses with fewer than 50 employees. Your role is to provide actionable, entrepreneur-friendly guidance that transforms businesses into acquisition-ready assets.

CONTEXT:
You're assisting Keski-Suomen Yrittäjät with their "Salesfit Assessment Tool" - designed to help Finnish SME entrepreneurs understand their company's readiness for sale and identify improvements that will increase enterprise value (EV) and attract quality buyers.

BUSINESS PROFILE:

Basic Information:
- Business Type: ${basicInfo.businessType}
- Location: ${basicInfo.location}
- Online Presence: ${basicInfo.website || 'Not provided'}
- Business Presentation: ${basicInfo.presentation || 'Not provided'}
- Years in Operation: ${basicInfo.operationPeriod}
- Target Sale Timeline: ${basicInfo.saleTime}

Financial Health (SDE Analysis):
- Net Profit (pre-tax): €${sdeCalculation.netProfit.toLocaleString()}
- Owner Compensation: €${sdeCalculation.ownerSalary.toLocaleString()}
- Personal Expenses: €${sdeCalculation.personalExpenses.toLocaleString()}
- One-Time/Unusual Expenses: €${sdeCalculation.unusualExpenses.toLocaleString()}
- Interest Expense: €${sdeCalculation.interest.toLocaleString()}
- Depreciation & Amortization: €${sdeCalculation.depreciation.toLocaleString()}
- **Total SDE: €${sdeCalculation.total.toLocaleString()}**

READINESS ASSESSMENT (Traffic Light System):

🟢 GREEN = Ready & Positive | 🔴 RED = Needs Attention & Improvement

A. ENTREPRENEUR READINESS:
${assessmentChecklist.entrepreneur.unanimousDecision ? '🟢' : '🔴'} Owner commitment to sale decision
${assessmentChecklist.entrepreneur.replaceableRole ? '🟢' : '🔴'} Owner replaceability in operations

B. BUSINESS OPERATIONS:
${assessmentChecklist.businessOperations.upToDateProducts ? '🟢' : '🔴'} Product/service modernization
${assessmentChecklist.businessOperations.suitableCustomers ? '🟢' : '🔴'} Customer base diversification
${assessmentChecklist.businessOperations.suitableSuppliers ? '🟢' : '🔴'} Supplier diversity
${assessmentChecklist.businessOperations.replaceableSubcontractors ? '🟢' : '🔴'} Subcontractor flexibility
${assessmentChecklist.businessOperations.customerAwareness ? '🟢' : '🔴'} Market awareness & visibility
${assessmentChecklist.businessOperations.positiveBrand ? '🟢' : '🔴'} Brand value & reputation

C. COMPANY FUNDAMENTALS:
${assessmentChecklist.company.increasedTurnover ? '🟢' : '🔴'} Revenue growth trajectory
${assessmentChecklist.company.profitable ? '🟢' : '🔴'} Profitability track record
${assessmentChecklist.company.positiveEquity ? '🟢' : '🔴'} Equity position strength
${assessmentChecklist.company.goodLiquidity ? '🟢' : '🔴'} Short-term debt management
${assessmentChecklist.company.currentReceivables ? '🟢' : '🔴'} Receivables currency
${assessmentChecklist.company.managedDebtRepayments ? '🟢' : '🔴'} Long-term debt servicing
${assessmentChecklist.company.goodStaffNumber ? '🟢' : '🔴'} Staff optimization
${assessmentChecklist.company.competentPersonnel ? '🟢' : '🔴'} Workforce competency
${assessmentChecklist.company.goodContracts ? '🟢' : '🔴'} Contract documentation quality
${assessmentChecklist.company.upToDateEmploymentContracts ? '🟢' : '🔴'} Employment contract compliance
${assessmentChecklist.company.productionControlSystem ? '🟢' : '🔴'} Production management systems
${assessmentChecklist.company.crmSystem ? '🟢' : '🔴'} Customer relationship systems
${assessmentChecklist.company.systematicDevelopment ? '🟢' : '🔴'} Business development approach

D. FUTURE PROSPECTS:
${assessmentChecklist.futureProspects.goodBusinessProspects ? '🟢' : '🔴'} Business growth potential
${assessmentChecklist.futureProspects.goodIndustryProspects ? '🟢' : '🔴'} Industry outlook
${assessmentChecklist.futureProspects.goodEnvironmentProspects ? '🟢' : '🔴'} Operating environment stability

---

IMPORTANT: You MUST respond in ENGLISH ONLY. Do not use Finnish or any other language in your response.

REQUIRED ANALYSIS (Structure your response with these exact sections):

## ⚠️ AI-GENERATED ASSESSMENT DISCLAIMER

**IMPORTANT NOTICE:** This assessment is generated by artificial intelligence and should be used as a guidance tool only. The recommendations provided are based on the information submitted and general market principles. Users should:
- Verify all suggestions with qualified financial, legal, and M&A professionals
- Conduct thorough due diligence before making business decisions
- Consider their unique business circumstances and local regulations
- Seek professional advice for legal, financial, and tax matters
- Use this assessment as a starting point for deeper analysis, not as final advice

This tool does NOT replace professional consultation with M&A advisors, accountants, lawyers, or business valuation experts.

---

## 1. SALESFIT SCORE & OVERALL READINESS
Provide an overall "Salesfit Score" (0-100) based on the traffic light system above. Explain the score and what it means for sale readiness given the ${basicInfo.saleTime} timeline.

## 2. ESTIMATED VALUATION RANGE
Using the SDE of €${sdeCalculation.total.toLocaleString()}:
- Apply typical Finnish SME industry multipliers for ${basicInfo.businessType}
- Consider that Finnish micro-enterprises (95.7% of companies) typically trade at 1.5-3x SDE
- Small enterprises may achieve 2.5-4x SDE with strong fundamentals
- Provide LOW, MEDIUM, and HIGH estimates based on current readiness
- Explain key value drivers and detractors affecting the multiple

## 3. CRITICAL STRENGTHS (Top 3-5)
Identify the most compelling selling points that will attract buyers:
- What makes this business acquisition-ready?
- Which green indicators create competitive advantage?
- What would make a buyer confident in this purchase?

## 4. AREAS REQUIRING ATTENTION (Priority Ranked)
List all 🔴 RED items that need improvement for sale success:
- Explain WHY each is concerning to buyers
- Quantify potential value impact where possible (€ or %)
- Indicate severity level: CRITICAL, HIGH PRIORITY, or MODERATE
- Suggest whether each issue could prevent a deal entirely

## 5. ACTIONABLE IMPROVEMENT ROADMAP
Create a prioritized action plan organized by timeline to sale (${basicInfo.saleTime}):

### IMMEDIATE PRIORITIES (0-3 months):
- Critical fixes that must be addressed
- Quick wins that boost value

### SHORT-TERM IMPROVEMENTS (3-6 months):
- Operational enhancements
- Documentation completion

### LONG-TERM DEVELOPMENT (6-12+ months):
- Strategic positioning
- Value maximization initiatives

For each action:
- ✓ Specific task description
- 💰 Estimated value impact (€ or % increase)
- ⏱️ Time required to implement
- 🎯 Expected outcome
- ⚠️ Risk if not addressed

## 6. BUYER ATTRACTION STRATEGY
Given the current state:
- Who are the ideal buyer profiles for this business?
- What will attract them most?
- What negotiation leverage points exist?
- How to position the business to maximize interested buyers?
- What buyer concerns need to be proactively addressed?

## 7. BENCHMARKING INSIGHTS
Compare this business to:
- Typical ${basicInfo.businessType} businesses in Finland
- Industry averages for key metrics
- Best practices for businesses of this size (reference: 95.7% of Finnish companies are micro-enterprises)
- Where does this business rank percentile-wise?

## 8. FINAL RECOMMENDATION
Provide a clear GO/NO-GO assessment for proceeding with sale in ${basicInfo.saleTime}:
- Should they proceed as planned?
- Should they delay and improve first? (If yes, by how long?)
- What's the realistic best-case outcome?
- What's the worst-case scenario if proceeding now?
- Key milestones to achieve before going to market

## 9. NEXT STEPS & PROFESSIONAL CONSULTATION
Recommend specific professionals they should consult:
- M&A advisor/business broker
- Business valuation expert
- Corporate lawyer
- Tax advisor
- Financial auditor
- Industry-specific consultants

---

RESPONSE GUIDELINES:
- **RESPOND IN ENGLISH ONLY** - This is mandatory
- Use clear, jargon-free language accessible to entrepreneurs
- Be direct but encouraging - focus on solutions
- Provide specific numbers, timelines, and action items
- Think like a buyer - what concerns would they have?
- Reference Finnish SME market context (95% are micro-enterprises)
- Format with markdown: headers, bold, bullet points, emojis for clarity
- Keep total response under 2500 words but be comprehensive
- Be realistic about challenges while maintaining an optimistic, action-oriented tone
- Include the AI disclaimer prominently at the start

Remember: Your goal is to help this entrepreneur achieve better valuation, attract more buyers, and negotiate from a position of strength - while being transparent that this is AI-generated guidance requiring professional verification.`;

    console.log('Processing business questionnaire assessment...');

    const response = await ai.models.generateContent({
      // https://ai.google.dev/gemini-api/docs/models
      model: "gemini-2.5-pro", // "gemini-2.5-flash"
      contents: prompt
    });

    console.log('Received assessment from Google Gemini');

    res.json({
      success: true,
      assessment: response.text,
      sdeTotal: sdeCalculation.total,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing questionnaire assessment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process business assessment',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      hasGoogleApiKey: !!process.env.GOOGLE_API_KEY
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for http://localhost:5173`);
  console.log(`🔑 Google API Key: ${process.env.GOOGLE_API_KEY ? 'Found' : 'Missing'}`);
});