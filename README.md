# Hackathon Project - Frontend & Backend Integration

This project demonstrates a full-stack application with React frontend and Express backend, integrated with Google Gemini AI API.

## 🏗️ Project Structure

```
Hackathon/
├── backend/                 # Express.js backend server
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   ├── .env                # Environment variables (not in git)
│   └── .env.example        # Example environment variables
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js      # API client configuration
│   │   ├── services/
│   │   │   └── geminiService.js  # Gemini AI service layer
│   │   ├── App.jsx         # Main React component
│   │   └── main.jsx        # React entry point
│   ├── package.json        # Frontend dependencies
│   ├── .env                # Frontend environment variables (not in git)
│   └── .env.example        # Example frontend environment variables
└── .gitignore              # Git ignore file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google API Key for Gemini AI

### 1. Get Google API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create or select a project
3. Generate an API key
4. Copy the API key for use in the next step

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env

# Edit .env and add your Google API key
# GOOGLE_API_KEY=your_actual_api_key_here
# PORT=8080

# Start the backend server
npm start

# Or use nodemon for development (auto-restart on changes)
npm run dev
```

The backend server will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env

# The .env file should contain:
# VITE_API_BASE_URL=http://localhost:8080

# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🏛️ Architecture

### Frontend Architecture

The frontend uses a layered architecture:

1. **Components Layer** (`src/App.jsx`)
   - React components for UI
   - State management with React hooks

2. **Service Layer** (`src/services/geminiService.js`)
   - Business logic for API interactions
   - Abstracts API calls from components

3. **API Client Layer** (`src/config/api.js`)
   - Centralized HTTP client
   - Error handling
   - Request/response interceptors

### Backend Architecture

The backend uses Express.js with:

1. **Server Configuration** (`server.js`)
   - Express app setup
   - CORS configuration
   - Middleware setup

2. **API Routes**
   - RESTful endpoints
   - Request validation
   - Error handling

3. **Google Gemini Integration**
   - Google Generative AI SDK
   - API key management
   - Response formatting

## 📦 Available Scripts

### Backend

- `npm start` - Start the server
- `npm run dev` - Start with nodemon (auto-restart)

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📚 Technologies Used

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **JavaScript (ES6+)** - Programming language
- **React Markdown** - Render markdown in React components

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing
- **@google/generative-ai** - Google Gemini AI SDK
