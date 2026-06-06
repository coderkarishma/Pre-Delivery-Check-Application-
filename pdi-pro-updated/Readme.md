# PDC Pro Delivery Check Application

PDC Pro Delivery Check Application is a full-stack web app for managing vehicle delivery inspections. It features a modern React/TypeScript frontend and a Node.js/Express backend, with MongoDB for data storage and Cloudinary for image uploads.

## Features
- User authentication (register/login)
- Step-by-step vehicle delivery inspection workflow
- Photo uploads to Cloudinary
- Dashboard for managing inspections
- PDF report generation
- Responsive UI with Tailwind CSS

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Image Uploads:** Cloudinary

## Project Structure
```
PDC Pro Delivery Check Application/
  backend/
    config/           # Database and Cloudinary configuration
    middleware/       # Express middlewares
    models/           # Mongoose models
    routes/           # API routes
    server.js         # Main Express server
    package.json      # Backend dependencies
  frontend/
    src/              # React source code
      components/     # UI components
      contexts/       # React Contexts
      utils/          # Utility functions
      index.css       # Global styles
      App.tsx         # Main App component
    index.html        # HTML entry point
    package.json      # Frontend dependencies
    vite.config.ts    # Vite configuration
```

## Getting Started

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd PDC-Pro-Delivery-Check-Application
```

### 2. Backend Setup
```sh
cd backend
npm install
# Create a .env file with MongoDB and Cloudinary credentials
npm start
```

### 3. Frontend Setup
```sh
cd frontend
npm install
npm run dev
```

### 4. Access the App
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## Environment Variables
Create a `.env` file in the `backend/` folder with:
```
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes
4. Push and create a pull request

## License
This project is licensed under the MIT License.

---
Made by Karishma