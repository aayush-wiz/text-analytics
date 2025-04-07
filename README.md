# Predictive Text Analysis Tool

A modern web application for analyzing and extracting insights from text documents, featuring a beautiful Notion-inspired UI and powerful text analysis capabilities.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Features

- **Text Analysis**
  - Sentiment Analysis
  - Keyword Extraction
  - Named Entity Recognition
  - Text Summarization
  - Readability Analysis

- **Modern UI/UX**
  - Notion-inspired Design
  - Responsive Layout
  - Dark/Light Mode
  - Customizable Settings

- **User Management**
  - Secure Authentication
  - User Preferences
  - Document Management
  - Analysis History

## 🛠️ Tech Stack

### Frontend
- React + TypeScript
- Vite (Build Tool)
- TailwindCSS (Styling)
- React Query (Data Fetching)
- React Router (Routing)
- Zod (Form Validation)

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Natural (NLP)
- JWT Authentication
- Winston (Logging)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/predictive-text-analysis.git
cd predictive-text-analysis
```

2. Install dependencies for both client and server:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Configure environment variables:
- Copy `.env.example` to `.env` in both client and server directories
- Update the values with your configuration

4. Start the development servers:

```bash
# Start the backend server (from the server directory)
npm run dev

# Start the frontend development server (from the client directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📁 Project Structure

```
/predictive-text-analysis/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service functions
│   │   ├── utils/        # Utility functions
│   │   └── App.tsx       # Main application component
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── package.json
│
└── README.md             # Project documentation
```

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## 🎯 API Endpoints

Detailed API documentation can be found in the [server/README.md](server/README.md) file.

## 🛡️ Security

- Password hashing using bcrypt
- JWT token-based authentication
- Input validation and sanitization
- CORS protection
- Rate limiting
- XSS protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Natural](https://github.com/NaturalNode/natural) 