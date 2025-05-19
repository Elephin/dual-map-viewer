# Dual Map Viewer

A React application that displays two synchronized Google Maps side by side, allowing users to compare different locations or views simultaneously.

## Features

- Two synchronized Google Maps
- Independent search functionality for each map
- Synchronized zoom controls
- Map type controls (roadmap/satellite)
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Elephin/dual-map-viewer.git
cd dual-map-viewer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Google Maps API key:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

## Usage

- Use the search boxes to find locations on each map
- Toggle between "Left Map Controls Right" and "Right Map Controls Left" to change which map controls the zoom synchronization
- Use the map type controls to switch between roadmap and satellite views

## License

This project is licensed under the MIT License - see the LICENSE file for details. 