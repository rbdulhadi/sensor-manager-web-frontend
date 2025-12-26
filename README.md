# Sensor Manager Web Frontend

A modern Angular single-page application for managing sensors, measurements, and users. This application consumes the RESTful web service from the microservice-architecture project.

## Features

- **Sensor Management** (30%):
  - Display all sensors in a table
  - Create new sensors
  - Edit existing sensors
  - Delete sensors
  - Filter sensors by type and status

- **Measurement Display** (30%):
  - Display measurements in tables (10%)
  - Visualize measurements as charts over time (20%)
  - Filter measurements by sensor and time range

- **Manual Measurement Entry** (10%):
  - Form for creating new measurements manually
  - Useful for testing purposes

- **User Authentication** (10%):
  - Login with username and password
  - JWT token-based authentication
  - Role-based access control (Read-Only, Read-Write)

- **User Management** (20%):
  - Display all users
  - Create new users
  - Edit existing users (username, email, role, password)
  - Set user permissions (roles)
  - Delete users
  - Only accessible to Read-Write users

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- The backend microservice-architecture project running on `http://localhost:8081`

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

1. Start the development server:
```bash
npm start
```

2. Navigate to `http://localhost:4200/`

3. The application will automatically reload if you change any of the source files.

## Building for Production

To build the application for production as a static site:

```bash
npm run build
```

The build artifacts will be stored in the `dist/sensor-manager-web-frontend/` directory. This directory contains all the files needed to serve the application as a static website.

### Serving the Production Build

You can serve the production build using any static file server:

**Using Python:**
```bash
cd dist/sensor-manager-web-frontend
python -m http.server 8080
```

**Using Node.js (http-server):**
```bash
npm install -g http-server
cd dist/sensor-manager-web-frontend
http-server -p 8080
```

**Using nginx:**
Copy the contents of `dist/sensor-manager-web-frontend` to your nginx web root directory.

## API Configuration

The application is configured to connect to the API Gateway at `http://localhost:8081`. If your backend is running on a different URL or port, update the API URLs in the following service files:

- `src/app/services/auth.service.ts`
- `src/app/services/sensor.service.ts`
- `src/app/services/measurement.service.ts`
- `src/app/services/user.service.ts`

## Project Structure

```
src/
├── app/
│   ├── components/          # Angular components
│   │   ├── login/           # Login component
│   │   ├── sensor-list/     # Sensor list component
│   │   ├── sensor-form/     # Sensor create/edit form
│   │   ├── measurement-list/ # Measurement list component
│   │   ├── measurement-form/ # Manual measurement entry form
│   │   ├── measurement-chart/ # Measurement charts
│   │   ├── user-list/       # User list component
│   │   └── user-form/       # User create/edit form
│   ├── guards/              # Route guards
│   │   ├── auth.guard.ts    # Authentication guard
│   │   └── readwrite.guard.ts # Read-write permission guard
│   ├── interceptors/        # HTTP interceptors
│   │   ├── auth.interceptor.ts # JWT token interceptor
│   │   └── error.interceptor.ts # Error handling interceptor
│   ├── models/              # TypeScript models/interfaces
│   │   ├── sensor.model.ts
│   │   ├── measurement.model.ts
│   │   └── user.model.ts
│   ├── services/            # Angular services
│   │   ├── auth.service.ts
│   │   ├── sensor.service.ts
│   │   ├── measurement.service.ts
│   │   └── user.service.ts
│   ├── app.component.ts     # Root component
│   └── app.routes.ts        # Route configuration
├── index.html
├── main.ts                  # Application entry point
└── styles.css               # Global styles
```

## Authentication

The application uses JWT (JSON Web Token) authentication. After successful login, the token is stored in localStorage and automatically included in all subsequent API requests via the HTTP interceptor.

### User Roles

- **READ_ONLY**: Can view sensors and measurements, but cannot create, edit, or delete
- **READ_WRITE**: Full access to all features including user management

## Usage

1. **Login**: Navigate to the login page and enter your credentials
2. **View Sensors**: Browse the list of sensors on the sensors page
3. **Manage Sensors**: Create, edit, or delete sensors (requires Read-Write role)
4. **View Measurements**: See all measurements in a table format
5. **View Charts**: Click on a sensor's "Chart" button to see measurements over time
6. **Create Measurements**: Use the "Add New Measurement" button to manually create measurements
7. **Manage Users**: Access user management from the navigation menu (requires Read-Write role)

## Technologies Used

- Angular 18
- TypeScript
- Chart.js & ng2-charts (for data visualization)
- RxJS (for reactive programming)
- CSS3 (for styling)

## License

This project is part of the SWVS course assignment.
