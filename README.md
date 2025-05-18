# Map One Scale

A web application that allows you to compare two Google Maps side by side with synchronized zoom levels.

## Features

- Two Google Maps displayed side by side
- Synchronized zoom levels between maps
- Option to choose which map controls the zoom level
- Responsive design that works on all screen sizes

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
4. Replace `YOUR_GOOGLE_MAPS_API_KEY` in `src/App.tsx` with your actual API key
5. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. The application will open with two maps side by side
2. Use the buttons at the top to choose which map controls the zoom level:
   - "Left Map Controls Right": Changes to the left map's zoom will affect the right map
   - "Right Map Controls Left": Changes to the right map's zoom will affect the left map
3. Navigate and zoom on either map as you normally would with Google Maps

## Technologies Used

- React
- TypeScript
- Google Maps JavaScript API
- @react-google-maps/api 