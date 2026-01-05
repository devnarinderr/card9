## Card9 – Digital Card & Identity Platform

Card9 is a digital card and identity platform that helps users create, manage, and share rich, interactive digital cards and catalogues. It combines a modern React dashboard with a Node.js/Express API and a relational database to deliver customizable cards, catalogues, and admin tools for managing users and content.

### Features

- **Digital cards & profiles**: Create and manage individual cards for people or brands, including dedicated single-card public pages.
- **Catalogues of cards**: Group cards into catalogues for teams, organizations, or campaigns, with dedicated catalogue views.
- **Admin dashboard**: Manage users, cards, and catalogues via a protected dashboard (`/admin` and `/app` routes).
- **Authentication & roles**: Login, password reset, and role-based routing (e.g. admin vs. regular user).
- **Media & assets**: Upload and serve card images and assets from the backend `uploads` directory.
- **Email & notifications**: Backend support for mailing flows (e.g. invitations, notifications, feedback) via dedicated mail routes and controllers.
- **Analytics & tracking**: Google Tag Manager integration in the React app for usage tracking and analytics.

### Tech Stack

- **Frontend**
  - React (`react`, `react-router-dom`, `react-helmet-async`)
  - Material UI 5 (`@mui/material`, `@mui/icons-material`, `@mui/lab`)
  - Redux Toolkit & React Redux for state management
  - Formik & Yup for forms and validation
  - Axios for API calls
  - Various utilities for QR codes, image handling, charts, and sharing (`react-qrcode-logo`, `html-to-image`, `react-share`, `react-google-charts`, etc.)
  - Custom theming (`theme/`), layouts, and modular page structure under `src/pages`, `src/components`, and `src/sections`

- **Backend**
  - Node.js with Express (`express`) as the HTTP server
  - Sequelize ORM with MySQL (`sequelize`, `mysql2`) for the relational database
  - Authentication & security: `bcryptjs`, `jsonwebtoken`, `express-session`, `passport` strategies (Google, Facebook, Twitter)
  - Background jobs & caching: `node-cron`, `node-cache`, and optional Redis integration
  - File uploads via `multer`, image and vCard utilities (`node-base64-image`, `vcard-creator`, `vcards-js`)
  - Mailing via `nodemailer` and `mailtrap`
  - API organized into controllers and routes for auth, cards, catalogues, admin, and mail

### Project Structure (High Level)

- **`card9-frontend/`** – React SPA dashboard and public pages
  - `src/` – main React source (pages, components, layouts, theme, store, services)
  - `public/` – static assets and HTML template
  - `package.json` – frontend dependencies and scripts

- **`card9-backend/`** – Node.js/Express API and server
  - `server.js` – main Express app (API routes, static serving of built React app, health checks)
  - `routes/` – route registration files (auth, card, catalogue, admin, mail, OAuth)
  - `controller/` – business logic for cards, catalogues, auth, admin, and mail
  - `models/` – Sequelize models for `user`, `card`, `catalogue`
  - `db/conn.js` – database connection and Sequelize initialization
  - `common/utilities/` – shared utilities (constants, mailer, helpers)
  - `uploads/` – uploaded images and assets
  - `client/` – folder where the **frontend production build** is placed (`client/build`)

### Local Development

#### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- MySQL (or compatible) database for the backend

#### Frontend (React)

- **Install dependencies**
  - From the `card9-frontend` directory:
    - `npm install`
- **Run in development mode**
  - `npm start`
  - The app uses `react-scripts` and is configured with a proxy pointing to the deployed API (`https://card9.me`). For local API development, you may want to adjust API base URLs in the frontend config.

#### Backend (API)

- **Install dependencies**
  - From the `card9-backend` directory:
    - `npm install`
- **Configure environment**
  - Create a `.env` file in `card9-backend/` with your environment variables (database credentials, JWT secrets, OAuth keys, mail config, etc.).
- **Run the server**
  - `npm start`
  - The Express app listens on `process.env.PORT` or `8080` by default.

### Building for Production

The backend is configured to serve the compiled React app from `card9-backend/client/build` and to mount it as static assets and the default HTML for non-API routes.

To prepare a production build:

1. **Build the frontend**
   - Navigate to `card9-frontend/` and run:
     - `npm run build`
   - This generates a `build/` directory in `card9-frontend/`.
2. **Copy the build into the backend**
   - Take the generated `card9-frontend/build` folder and place it inside the backend under:
   - `card9-backend/client/build`
   - (If `client/` does not exist, create it, then place the `build` folder inside.)
3. **Run the backend in production mode**
   - From `card9-backend/`, run:
     - `npm start`
   - The Express server will:
     - Serve API routes under the configured endpoints (auth, cards, catalogues, mail, etc.).
     - Serve the React app from `client/build` for the root route `/` and for any non-API paths.

### Deployment Notes

- The backend is designed to work with process managers or hosting platforms that handle the Node.js process (e.g. Passenger on Hostinger). In `server.js` the Express app is exported rather than calling `app.listen()` directly so that the hosting platform can manage the server lifecycle.
- Static assets (including uploaded images) are served from `card9-backend/uploads` via the `/images` path.

### License

- The frontend is based on the Minimal Material Kit React (`@minimal/material-kit-react`) and follows its MIT license.
- Backend code is licensed as defined in `card9-backend/package.json` (currently `ISC`).


