# Quick Setup Guide

## Prerequisites

Before running this Angular application, ensure you have:

1. **Node.js** (v18 or higher) and npm installed
2. **Backend services running** - The microservice-architecture project should be running:
   - Eureka Server (port 8761)
   - Config Server (if used)
   - Sensor Service (registered with Eureka)
   - API Gateway (port 8081)

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Verify backend is running:**
   - API Gateway should be accessible at `http://localhost:8081`
   - Test the API by visiting: `http://localhost:8081/api/sensors` (will require authentication)

3. **Start the Angular development server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Open your browser and navigate to `http://localhost:4200`
   - You'll be redirected to the login page

## First Time Setup

1. **Create a user account:**
   - Since user registration might require an existing user, you may need to create the first user directly through the backend API or database
   - Alternatively, check if there are default users in the backend seed data

2. **Login:**
   - Use your credentials to log in
   - After successful login, you'll have access to the sensor management features

## Building for Production

To build a static version of the application:

```bash
npm run build
```

The built files will be in `dist/sensor-manager-web-frontend/` directory. You can deploy these files to any static web server.

## Troubleshooting

### CORS Errors
- Ensure the API Gateway has CORS enabled (it should be configured already)
- Check that the API Gateway is running on port 8081

### Authentication Errors
- Verify that the JWT token is being stored correctly in localStorage
- Check browser console for detailed error messages
- Ensure the backend authentication endpoint is working

### Chart Not Displaying
- Ensure Chart.js and ng2-charts are properly installed
- Check browser console for any JavaScript errors
- Verify that measurement data exists for the selected sensor and time range

## Development Tips

- Use browser DevTools to monitor API requests and responses
- Check the Network tab to verify API calls are being made correctly
- Use the Console tab to see any error messages
- The application uses JWT tokens stored in localStorage for authentication
