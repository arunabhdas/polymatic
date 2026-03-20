# PolyMatic Deployment Instructions

## Prerequisites
- Node.js 20+
- npm

## Local Development
1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
   - This starts both the Express/WebSocket backend and the Vite frontend.
3. Access the application at `http://localhost:3000`

## Production Build
1. Build the frontend: `npm run build`
2. Start the production server: `npm start`
   - The Express server will serve the static files from `web/dist` and handle WebSocket connections.
