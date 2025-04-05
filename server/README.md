# Predictive Text Analysis Tool - Backend

This is the backend API for the Predictive Text Analysis Tool, a comprehensive application for analyzing and extracting insights from text documents.

## Features

- User authentication and authorization
- Text document management
- Text analysis including:
  - Sentiment analysis
  - Keyword extraction
  - Named entity recognition
  - Text summarization
  - Readability analysis
- Model management for different analysis types
- Comprehensive API with proper error handling and validation

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **Natural** - Natural language processing library
- **JWT** - Authentication
- **Winston** - Logging

## Project Structure

```
/text-analysis-backend/
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/             # Database models
├── routes/             # API routes
├── services/           # Business logic
├── utils/              # Utility functions
├── tests/              # Tests
├── .env                # Environment variables
├── package.json        # Dependencies
├── server.js           # Application entry point
└── README.md           # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd text-analysis-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Copy the `.env.example` file to `.env`
   - Update the values in the `.env` file with your configuration

4. Start MongoDB:

   - If using a local installation:
     ```bash
     mongod
     ```
   - If using MongoDB Atlas, make sure your connection string is correctly set in the `.env` file

5. Start the server:

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Documentation

### Authentication

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| POST   | `/api/auth/register`       | Register a new user     |
| POST   | `/api/auth/login`          | Login user              |
| GET    | `/api/auth/me`             | Get current user        |
| PUT    | `/api/auth/updatedetails`  | Update user details     |
| PUT    | `/api/auth/updatepassword` | Update password         |
| GET    | `/api/auth/logout`         | Logout user             |
| PUT    | `/api/auth/preferences`    | Update user preferences |

### Text Documents

| Method | Endpoint                 | Description                   |
| ------ | ------------------------ | ----------------------------- |
| GET    | `/api/texts`             | Get all user's text documents |
| POST   | `/api/texts`             | Create a new text document    |
| GET    | `/api/texts/:id`         | Get single text document      |
| PUT    | `/api/texts/:id`         | Update text document          |
| DELETE | `/api/texts/:id`         | Delete text document          |
| POST   | `/api/texts/:id/analyze` | Analyze text document         |
| GET    | `/api/texts/:id/results` | Get analysis results          |

### Models

| Method | Endpoint                        | Description                      |
| ------ | ------------------------------- | -------------------------------- |
| GET    | `/api/models`                   | Get all models                   |
| POST   | `/api/models`                   | Create a new model (admin)       |
| GET    | `/api/models/:id`               | Get single model                 |
| PUT    | `/api/models/:id`               | Update model (admin)             |
| DELETE | `/api/models/:id`               | Delete model (admin)             |
| PUT    | `/api/models/:id/toggle-status` | Toggle model status (admin)      |
| GET    | `/api/models/type/:type`        | Get models by type               |
| GET    | `/api/models/languages`         | Get supported languages          |
| PUT    | `/api/models/:id/performance`   | Update model performance (admin) |

### Users (Admin only)

| Method | Endpoint                       | Description         |
| ------ | ------------------------------ | ------------------- |
| GET    | `/api/users`                   | Get all users       |
| POST   | `/api/users`                   | Create a new user   |
| GET    | `/api/users/:id`               | Get single user     |
| PUT    | `/api/users/:id`               | Update user         |
| DELETE | `/api/users/:id`               | Delete user         |
| GET    | `/api/users/:id/stats`         | Get user stats      |
| PUT    | `/api/users/:id/resetpassword` | Reset user password |

## Testing

Run tests using:

```bash
npm test
```

## Deployment

For production deployment:

1. Set environment variables for production
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm start
   ```

## Error Handling

The API uses a standardized error format:

```json
{
  "success": false,
  "error": "Error message",
  "details": [
    {
      "param": "field_name",
      "msg": "Validation error message",
      "value": "Submitted value"
    }
  ]
}
```

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Data Models

### User

- id
- name
- email
- password (hashed)
- role (user/admin)
- organization
- preferences
- createdAt
- updatedAt

### TextDocument

- id
- title
- content
- language
- contentType
- tags
- metadata (wordCount, charCount, etc.)
- user (reference)
- status
- isPublic
- createdAt
- updatedAt

### AnalysisResult

- id
- textDocument (reference)
- user (reference)
- analysisType
- model (reference)
- results (sentiment, keywords, entities, etc.)
- processingTime
- status
- error
- createdAt
- updatedAt

### Model

- id
- name
- version
- type
- description
- languages
- parameters
- isActive
- performance
- creator (reference)
- source
- config
- createdAt
- updatedAt

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- [Your Name](https://github.com/yourusername)
