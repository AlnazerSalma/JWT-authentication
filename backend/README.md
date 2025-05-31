# Express API Server

This is a modular Node.js and Express API server that serves static JSON data for various frontend components like sliders, careers, pricing, work showcases, and home videos.

## Tech Stack
- for backend (Node.js with express)
- for frontend (react js) 
- CORS => To lets React (localhost:3000) communicate with Node.js (localhost:5000) without being blocked by the browser’s security, since they're on different origins.

##  API Endpoints
- GET /api/sliders  => Returns slider items used on  the starter page
- GET /api/careers  => Returns career items data used on  the career page
- GET /api/pricing  => Returns pricing items data used on  the pricing page
- GET /api/works    => Returns work items data used on both work card and home page slider 
- GET /api/homeVideos => Returns video data used on the home video slider 

## Install Dependencies
npm i

## Install CORS
npm install cors

## Run the Server side 
npm run dev

## Run the client side 
npm start

## Access the Server
Go to http://localhost:5000
