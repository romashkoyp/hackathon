import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './QuestionnaireForm.css';
import { submitQuestionnaireAssessment } from '../services/geminiService';
import { ApiError } from '../config/api';
import { ThreeDots } from 'react-loader-spinner'

function QuestionnaireForm() {
  const [formData, setFormData] = useState({
    businessType: '',
    location: '',
    website: '',
    presentation: '',
    operationPeriod: '',
    saleTime: '',
    netProfit: '',
    ownerSalary: '',
    personalExpenses: '',
    unusualExpenses: '',
    interest: '',
    depreciation: '',
    entrepreneurChecks: {
      unanimousDecision: true,
      replaceableRole: true,
    },
    businessOperationsChecks: {
      upToDateProducts: true,
      suitableCustomers: true,
      suitableSuppliers: true,
      replaceableSubcontractors: true,
      customerAwareness: true,
      positiveBrand: true,
    },
    companyChecks: {
      increasedTurnover: true,
      profitable: true,
      positiveEquity: true,
      goodLiquidity: true,
      currentReceivables: true,
      managedDebtRepayments: true,
      goodStaffNumber: true,
      competentPersonnel: true,
      goodContracts: true,
      upToDateEmploymentContracts: true,
      productionControlSystem: true,
      crmSystem: true,
      systematicDevelopment: true,
    },
    futureProspectsChecks: {
      goodBusinessProspects: true,
      goodIndustryProspects: true,
      goodEnvironmentProspects: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Markdown content for header and sections
  const headerTitle = "# Business Assessment Powered by AI";
  const headerSubtitle = "Complete the form below to receive a comprehensive assessment of your business";

  // Section headings with markdown support
  const sectionHeadings = {
    basicInfo: "## Basic Information",
    sdeCalculation: "## SDE Calculation *(provide numbers for the last year)*",
    businessAssessment: "## Business Assessment",
    results: "## Business Assessment **Results**"
  };

  // Subsection headings with markdown support
  const subsectionHeadings = {
    entrepreneur: "### A. **The Entrepreneur**",
    businessOperations: "### B. **Business Operations**",
    company: "### C. **The Company**",
    futureProspects: "### D. **Future Prospects**"
  };

  // Helper component for rendering markdown section headings
  const SectionHeading = ({ markdown }) => (
    <ReactMarkdown
      components={{
        h2: (props) => <h2 style={{ color: '#333', marginBottom: '25px', fontSize: '1.8em', fontWeight: '600' }} {...props} />,
        strong: (props) => <strong style={{ fontWeight: '700' }} {...props} />,
        em: (props) => <em style={{ fontStyle: 'italic', fontWeight: '400' }} {...props} />
      }}
    >
      {markdown}
    </ReactMarkdown>
  );

  // Helper component for rendering markdown subsection headings
  const SubsectionHeading = ({ markdown }) => (
    <ReactMarkdown
      components={{
        h3: (props) => <h3 style={{ color: '#555', margin: '25px 0 15px 0', fontSize: '1.3em', fontWeight: '600' }} {...props} />,
        strong: (props) => <strong style={{ fontWeight: '700', color: '#667eea' }} {...props} />
      }}
    >
      {markdown}
    </ReactMarkdown>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (category, name) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: !prev[category][name]
      }
    }));
  };

  const calculateSDE = () => {
    return (
      (parseFloat(formData.netProfit) || 0) +
      (parseFloat(formData.ownerSalary) || 0) +
      (parseFloat(formData.personalExpenses) || 0) +
      (parseFloat(formData.unusualExpenses) || 0) +
      (parseFloat(formData.interest) || 0) +
      (parseFloat(formData.depreciation) || 0)
    );
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    const sdeTotal = calculateSDE();

    const submissionData = {
      basicInfo: {
        businessType: formData.businessType,
        location: formData.location || 'Not provided',
        website: formData.website || 'Not provided',
        presentation: formData.presentation || 'Not provided',
        operationPeriod: formData.operationPeriod || 'Not provided',
        saleTime: formData.saleTime,
      },
      sdeCalculation: {
        netProfit: parseFloat(formData.netProfit) || 0,
        ownerSalary: parseFloat(formData.ownerSalary) || 0,
        personalExpenses: parseFloat(formData.personalExpenses) || 0,
        unusualExpenses: parseFloat(formData.unusualExpenses) || 0,
        interest: parseFloat(formData.interest) || 0,
        depreciation: parseFloat(formData.depreciation) || 0,
        total: sdeTotal,
      },
      assessmentChecklist: {
        entrepreneur: formData.entrepreneurChecks,
        businessOperations: formData.businessOperationsChecks,
        company: formData.companyChecks,
        futureProspects: formData.futureProspectsChecks,
      },
    };

    console.log('Submitting questionnaire data to backend:', submissionData);

    try {
      const response = await submitQuestionnaireAssessment(submissionData);

      if (response.success) {
        setResults({
          assessment: response.assessment,
          sdeTotal: response.sdeTotal,
          timestamp: response.timestamp
        });
        console.log('Assessment received successfully');
      } else {
        setError(response.error || 'Failed to get assessment from Gemini AI');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while processing your assessment');
      }
      console.error('Error submitting questionnaire:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <ReactMarkdown
          components={{
            h1: (props) => <h1 style={{ fontSize: '2.5em', marginBottom: '15px', fontWeight: '700', position: 'relative', zIndex: 1, textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }} {...props} />,
            strong: (props) => <strong style={{ fontWeight: '700' }} {...props} />
          }}
        >
          {headerTitle}
        </ReactMarkdown>
        <ReactMarkdown
          components={{
            p: (props) => <p style={{ fontSize: '1.1em', opacity: 0.95, position: 'relative', zIndex: 1, textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }} {...props} />,
            strong: (props) => <strong style={{ fontWeight: '700' }} {...props} />
          }}
        >
          {headerSubtitle}
        </ReactMarkdown>
      </div>

      <div className="form-container">
        {loading && (
          <div className="loading" id="loadingIndicator">
            <p>Processing your request... This may take a moment.</p>
            <img src="https://i.gifer.com/ZKZg.gif" alt="Loading" width="50" />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <SectionHeading markdown={sectionHeadings.basicInfo} />
            <div className="form-group">
              <label className="required" htmlFor="businessType">1. What kind of business are you selling?</label>
              <input
                type="text"
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                required
                placeholder="e.g., Online service, Retail store, Pizzeria etc."
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">2. In which city or cities is your business located?</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">3. What is the website of your company?</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://www.example.com"
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="presentation">4. Upload your business presentation:</label>
              <textarea
                id="presentation"
                name="presentation"
                value={formData.presentation}
                onChange={handleInputChange}
                rows="3"
                placeholder="Brief description of your business..."
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="operationPeriod">5. How long has your business been operating?</label>
              <input
                type="text"
                id="operationPeriod"
                name="operationPeriod"
                value={formData.operationPeriod}
                onChange={handleInputChange}
                placeholder="e.g., 5 years"
              />
            </div>

            <div className="form-group">
              <label className="required" htmlFor="saleTime">6. When are you going to sell your company?</label>
              <input
                type="text"
                id="saleTime"
                name="saleTime"
                value={formData.saleTime}
                onChange={handleInputChange}
                required
                placeholder="e.g., Within 6 months, 1-2 years"
              />
            </div>
          </div>

          <div className="form-section">
            <SectionHeading markdown={sectionHeadings.sdeCalculation} />
            <div className="form-group inline-group">
              <label className="required" htmlFor="netProfit">Net Profit (before tax) €:</label>
              <input
                type="number"
                id="netProfit"
                name="netProfit"
                value={formData.netProfit}
                onChange={handleInputChange}
                required
                placeholder="0"
              />
            </div>

            <div className="form-group inline-group">
              <label htmlFor="ownerSalary">Your Total Annual Salary/Compensation, €:</label>
              <input
                type="number"
                id="ownerSalary"
                name="ownerSalary"
                value={formData.ownerSalary}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>

            <div className="form-group inline-group">
              <label htmlFor="personalExpenses">Personal Expenses Paid by Business, €:</label>
              <input
                type="number"
                id="personalExpenses"
                name="personalExpenses"
                value={formData.personalExpenses}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>

            <div className="form-group inline-group">
              <label htmlFor="unusualExpenses">One-Time or Unusual Expenses, €:</label>
              <input
                type="number"
                id="unusualExpenses"
                name="unusualExpenses"
                value={formData.unusualExpenses}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>

            <div className="form-group inline-group">
              <label htmlFor="interest">Interest Paid on Business Loans, €:</label>
              <input
                type="number"
                id="interest"
                name="interest"
                value={formData.interest}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>

            <div className="form-group inline-group">
              <label htmlFor="depreciation">Depreciation and Amortization, €:</label>
              <input
                type="number"
                id="depreciation"
                name="depreciation"
                value={formData.depreciation}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-section">
            <SectionHeading markdown={sectionHeadings.businessAssessment} />

            <SubsectionHeading markdown={subsectionHeadings.entrepreneur} />
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="unanimousDecision"
                checked={formData.entrepreneurChecks.unanimousDecision}
                onChange={() => handleCheckboxChange('entrepreneurChecks', 'unanimousDecision')}
              />
              <label htmlFor="unanimousDecision" className="checkbox-label">
                The owners are unanimous about selling the company or the entrepreneur has made a genuine decision to sell the company.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="replaceableRole"
                checked={formData.entrepreneurChecks.replaceableRole}
                onChange={() => handleCheckboxChange('entrepreneurChecks', 'replaceableRole')}
              />
              <label htmlFor="replaceableRole" className="checkbox-label">
                The entrepreneur's role in the company is easily replaceable.
              </label>
            </div>

            <SubsectionHeading markdown={subsectionHeadings.businessOperations} />
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="upToDateProducts"
                checked={formData.businessOperationsChecks.upToDateProducts}
                onChange={() => handleCheckboxChange('businessOperationsChecks', 'upToDateProducts')}
              />
              <label htmlFor="upToDateProducts" className="checkbox-label">
                The company's products and services are up-to-date.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="suitableCustomers"
                checked={formData.businessOperationsChecks.suitableCustomers}
                onChange={() => handleCheckboxChange('businessOperationsChecks', 'suitableCustomers')}
              />
              <label htmlFor="suitableCustomers" className="checkbox-label">
                There is a suitable number of customers in relation to the business volume.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="suitableSuppliers"
                checked={formData.businessOperationsChecks.suitableSuppliers}
                onChange={() => handleCheckboxChange('businessOperationsChecks', 'suitableSuppliers')}
              />
              <label htmlFor="suitableSuppliers" className="checkbox-label">
                There is a suitable number of suppliers in relation to the business volume.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="replaceableSubcontractors"
                checked={formData.businessOperationsChecks.replaceableSubcontractors}
                onChange={() => handleCheckboxChange('businessOperationsChecks', 'replaceableSubcontractors')}
              />
              <label htmlFor="replaceableSubcontractors" className="checkbox-label">
                A subcontractor or subcontractors can be replaced if necessary.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="customerAwareness"
                checked={formData.businessOperationsChecks.customerAwareness}
                onChange={() => handleCheckboxChange('businessOperationsChecks', 'customerAwareness')}
              />
              <label htmlFor="customerAwareness" className="checkbox-label">
                Current customers and a significant number of potential new customers know about the company's products and services.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="positiveBrand"
                checked={formData.businessOperationsChecks.positiveBrand}
                onChange={() => handleCheckboxChange('businessOperationsChecks', 'positiveBrand')}
              />
              <label htmlFor="positiveBrand" className="checkbox-label">
                The value of the company's brand is positive.
              </label>
            </div>

            <SubsectionHeading markdown={subsectionHeadings.company} />
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="increasedTurnover"
                checked={formData.companyChecks.increasedTurnover}
                onChange={() => handleCheckboxChange('companyChecks', 'increasedTurnover')}
              />
              <label htmlFor="increasedTurnover" className="checkbox-label">
                Turnover has increased in recent years.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="profitable"
                checked={formData.companyChecks.profitable}
                onChange={() => handleCheckboxChange('companyChecks', 'profitable')}
              />
              <label htmlFor="profitable" className="checkbox-label">
                The company has been profitable in recent years.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="positiveEquity"
                checked={formData.companyChecks.positiveEquity}
                onChange={() => handleCheckboxChange('companyChecks', 'positiveEquity')}
              />
              <label htmlFor="positiveEquity" className="checkbox-label">
                The company's equity is clearly positive.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="goodLiquidity"
                checked={formData.companyChecks.goodLiquidity}
                onChange={() => handleCheckboxChange('companyChecks', 'goodLiquidity')}
              />
              <label htmlFor="goodLiquidity" className="checkbox-label">
                Short-term debts do not affect the company's liquidity.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="currentReceivables"
                checked={formData.companyChecks.currentReceivables}
                onChange={() => handleCheckboxChange('companyChecks', 'currentReceivables')}
              />
              <label htmlFor="currentReceivables" className="checkbox-label">
                All receivables are current and are paid on time.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="managedDebtRepayments"
                checked={formData.companyChecks.managedDebtRepayments}
                onChange={() => handleCheckboxChange('companyChecks', 'managedDebtRepayments')}
              />
              <label htmlFor="managedDebtRepayments" className="checkbox-label">
                Debt repayments are managed easily.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="goodStaffNumber"
                checked={formData.companyChecks.goodStaffNumber}
                onChange={() => handleCheckboxChange('companyChecks', 'goodStaffNumber')}
              />
              <label htmlFor="goodStaffNumber" className="checkbox-label">
                The number of staff is good in relation to the business volume.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="competentPersonnel"
                checked={formData.companyChecks.competentPersonnel}
                onChange={() => handleCheckboxChange('companyChecks', 'competentPersonnel')}
              />
              <label htmlFor="competentPersonnel" className="checkbox-label">
                The personnel's competence meets the industry's requirements.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="goodContracts"
                checked={formData.companyChecks.goodContracts}
                onChange={() => handleCheckboxChange('companyChecks', 'goodContracts')}
              />
              <label htmlFor="goodContracts" className="checkbox-label">
                The company's written contracts are good and support the business.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="upToDateEmploymentContracts"
                checked={formData.companyChecks.upToDateEmploymentContracts}
                onChange={() => handleCheckboxChange('companyChecks', 'upToDateEmploymentContracts')}
              />
              <label htmlFor="upToDateEmploymentContracts" className="checkbox-label">
                The company's employment contracts are in writing and their content is up to date.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="productionControlSystem"
                checked={formData.companyChecks.productionControlSystem}
                onChange={() => handleCheckboxChange('companyChecks', 'productionControlSystem')}
              />
              <label htmlFor="productionControlSystem" className="checkbox-label">
                The company has a functional production control system.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="crmSystem"
                checked={formData.companyChecks.crmSystem}
                onChange={() => handleCheckboxChange('companyChecks', 'crmSystem')}
              />
              <label htmlFor="crmSystem" className="checkbox-label">
                The company has a functional customer relationship management system.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="systematicDevelopment"
                checked={formData.companyChecks.systematicDevelopment}
                onChange={() => handleCheckboxChange('companyChecks', 'systematicDevelopment')}
              />
              <label htmlFor="systematicDevelopment" className="checkbox-label">
                The company has been systematically developed.
              </label>
            </div>

            <SubsectionHeading markdown={subsectionHeadings.futureProspects} />
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="goodBusinessProspects"
                checked={formData.futureProspectsChecks.goodBusinessProspects}
                onChange={() => handleCheckboxChange('futureProspectsChecks', 'goodBusinessProspects')}
              />
              <label htmlFor="goodBusinessProspects" className="checkbox-label">
                The future prospects for the business are good.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="goodIndustryProspects"
                checked={formData.futureProspectsChecks.goodIndustryProspects}
                onChange={() => handleCheckboxChange('futureProspectsChecks', 'goodIndustryProspects')}
              />
              <label htmlFor="goodIndustryProspects" className="checkbox-label">
                The future prospects for the industry are good.
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="goodEnvironmentProspects"
                checked={formData.futureProspectsChecks.goodEnvironmentProspects}
                onChange={() => handleCheckboxChange('futureProspectsChecks', 'goodEnvironmentProspects')}
              />
              <label htmlFor="goodEnvironmentProspects" className="checkbox-label">
                The future prospects for the company's operating environment are good.
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? <p style={{ display: 'flex', alignItems: 'center', gap: '10px', alignContent: 'center', justifyContent: 'center' }}>Processing<ThreeDots color="#fff" height={20} width={30} radius={5}/></p>
              : 'Submit for Assessment'
            }
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: '#f8d7da',
            color: '#721c24',
            border: '2px solid #f5c6cb',
            borderRadius: '12px',
            borderLeft: '4px solid #dc3545'
          }}>
            <h3 style={{ marginBottom: '10px', color: '#721c24' }}>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {results && (
          <div id="results" style={{ display: 'block' }}>
            <SectionHeading markdown={sectionHeadings.results} />
            <div id="resultContent">
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <p style={{
                  fontSize: '1.1em',
                  fontWeight: '600',
                  color: '#667eea',
                  marginBottom: '10px'
                }}>
                  Total SDE (Seller's Discretionary Earnings): €{results.sdeTotal?.toLocaleString()}
                </p>
                <p style={{ fontSize: '0.9em', color: '#666' }}>
                  Assessment generated on: {new Date(results.timestamp).toLocaleString()}
                </p>
              </div>
              <div
                className="markdown-content"
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  lineHeight: '1.8',
                  color: '#333'
                }}
              >
                <ReactMarkdown
                  components={{
                    h1: (props) => <h1 style={{ color: '#667eea', marginTop: '20px', marginBottom: '15px', fontSize: '2em' }} {...props} />,
                    h2: (props) => <h2 style={{ color: '#667eea', marginTop: '20px', marginBottom: '12px', fontSize: '1.6em' }} {...props} />,
                    h3: (props) => <h3 style={{ color: '#667eea', marginTop: '15px', marginBottom: '10px', fontSize: '1.3em' }} {...props} />,
                    p: (props) => <p style={{ marginBottom: '10px' }} {...props} />,
                    ul: (props) => <ul style={{ marginLeft: '20px', marginBottom: '10px' }} {...props} />,
                    ol: (props) => <ol style={{ marginLeft: '20px', marginBottom: '10px' }} {...props} />,
                    li: (props) => <li style={{ marginBottom: '5px' }} {...props} />,
                    strong: (props) => <strong style={{ fontWeight: '700', color: '#333' }} {...props} />,
                    em: (props) => <em style={{ fontStyle: 'italic' }} {...props} />,
                    blockquote: (props) => <blockquote style={{ borderLeft: '4px solid #667eea', paddingLeft: '15px', marginLeft: '0', color: '#555' }} {...props} />,
                    code: ({inline, ...props}) =>
                      inline
                        ? <code style={{ background: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontSize: '0.9em' }} {...props} />
                        : <code style={{ display: 'block', background: '#f4f4f4', padding: '10px', borderRadius: '5px', fontSize: '0.9em', overflowX: 'auto' }} {...props} />
                  }}
                >
                  {results.assessment}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionnaireForm;

