# Atom URL Shortener

Atom is a robust, full-stack URL shortening service engineered for high performance, ease of use, and detailed analytics tracking. Designed with a minimalistic, monochromatic user interface, it provides a seamless developer and end-user experience.

## Architecture Overview

This project is structured as a monorepo containing distinct frontend and backend applications:

- **Frontend:** Built with React and Vite. The interface emphasizes typography-driven, minimalistic design (utilizing Lekton, Oswald, and Silkscreen fonts).
- **Backend:** Powered by NestJS. It handles API routing, JWT-based authentication, URL redirection logic, and analytics aggregation. 
- **Database:** Uses MongoDB (via Mongoose) for persistent storage of users, URLs, and click analytics. A local in-memory MongoDB server is supported for zero-configuration development environments.

## Core Features

- **Authentication:** Secure user registration and login utilizing JWT strategies.
- **Link Management:** Shorten long URLs, apply custom aliases, and organize links with titles.
- **Analytics:** Track total clicks and access historical usage statistics for each shortened link.
- **Optimized Redirection:** Dedicated backend endpoints for fast HTTP 301 redirects.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance (optional, falls back to mongodb-memory-server for local testing)

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Start the NestJS server: `npm run start:dev`

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:3000`.

## License

This project is open source and available under the MIT License.
