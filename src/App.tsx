import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
import './App.css';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 0,
  lng: 0
};

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
console.log('API Key:', GOOGLE_MAPS_API_KEY);

function App() {
  const [leftMap, setLeftMap] = useState<google.maps.Map | null>(null);
  const [rightMap, setRightMap] = useState<google.maps.Map | null>(null);
  const [syncDirection, setSyncDirection] = useState<'left' | 'right'>('right');
  const [leftAutocomplete, setLeftAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [rightAutocomplete, setRightAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [gridSpacing, setGridSpacing] = useState(100);
  const [gridOpacity, setGridOpacity] = useState(1);
  const [gridType, setGridType] = useState<'rectangular' | 'circular'>('rectangular');
  const [showCenterLines, setShowCenterLines] = useState(true);
  const [circleCount, setCircleCount] = useState(20);

  const onLeftMapLoad = (map: google.maps.Map) => {
    setLeftMap(map);
  };

  const onRightMapLoad = (map: google.maps.Map) => {
    setRightMap(map);
  };

  const onLeftMapZoomChanged = () => {
    if (leftMap && rightMap && syncDirection === 'left') {
      rightMap.setZoom(leftMap.getZoom()!);
    }
  };

  const onRightMapZoomChanged = () => {
    if (leftMap && rightMap && syncDirection === 'right') {
      leftMap.setZoom(rightMap.getZoom()!);
    }
  };

  const onLeftPlaceChanged = () => {
    if (leftAutocomplete && leftMap) {
      const place = leftAutocomplete.getPlace();
      if (place.geometry?.location) {
        leftMap.panTo(place.geometry.location);
        leftMap.setZoom(15);
      }
    }
  };

  const onRightPlaceChanged = () => {
    if (rightAutocomplete && rightMap) {
      const place = rightAutocomplete.getPlace();
      if (place.geometry?.location) {
        rightMap.panTo(place.geometry.location);
        rightMap.setZoom(15);
      }
    }
  };

  const mapOptions = {
    tilt: 0,
    mapTypeId: 'roadmap',
    rotateControl: true,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: 2, // HORIZONTAL_BAR
      position: 1, // TOP_RIGHT
      mapTypeIds: ['roadmap', 'satellite']
    },
    gestureHandling: 'greedy',
    zoomControl: true,
    scaleControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false
  };

  // Generate SVG for circular grid
  const generateCircularGridSVG = () => {
    const size = 2000; // Increased SVG size for better coverage
    const center = size / 2;
    const circles = [];
    
    // Calculate the number of circles needed to cover the entire map
    const maxRadius = Math.sqrt(size * size + size * size) / 2; // Diagonal distance
    const actualCircleCount = Math.ceil(maxRadius / gridSpacing);
    
    for (let i = 1; i <= actualCircleCount; i++) {
      const radius = (gridSpacing * i);
      circles.push(
        <circle
          key={i}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`rgba(0, 0, 0, ${gridOpacity})`}
          strokeWidth="1"
        />
      );
    }

    return (
      <svg
        width="200%"
        height="200%"
        viewBox={`0 0 ${size} ${size}`}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
      >
        {circles}
      </svg>
    );
  };

  return (
    <LoadScript 
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={['places']}
    >
      <div className="App">
        <div className="controls">
          <button 
            onClick={() => setSyncDirection('left')}
            className={syncDirection === 'left' ? 'active' : ''}
          >
            Left Map Controls Right
          </button>
          <button 
            onClick={() => setSyncDirection('right')}
            className={syncDirection === 'right' ? 'active' : ''}
          >
            Right Map Controls Left
          </button>
          <div className="grid-controls">
            <label>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
              />
              Show Grid
            </label>
            {showGrid && (
              <>
                <label>
                  Grid Type:
                  <select 
                    value={gridType} 
                    onChange={(e) => setGridType(e.target.value as 'rectangular' | 'circular')}
                  >
                    <option value="rectangular">Rectangular</option>
                    <option value="circular">Circular</option>
                  </select>
                </label>
                {gridType === 'circular' && (
                  <label>
                    Number of Circles:
                    <input
                      type="range"
                      min="10"
                      max="50"
                      step="1"
                      value={circleCount}
                      onChange={(e) => setCircleCount(Number(e.target.value))}
                    />
                    {circleCount}
                  </label>
                )}
                <label>
                  <input
                    type="checkbox"
                    checked={showCenterLines}
                    onChange={(e) => setShowCenterLines(e.target.checked)}
                  />
                  Show Center Lines
                </label>
                <label>
                  Grid Spacing:
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="50"
                    value={gridSpacing}
                    onChange={(e) => setGridSpacing(Number(e.target.value))}
                  />
                  {gridSpacing}px
                </label>
                <label>
                  Grid Opacity:
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={gridOpacity * 100}
                    onChange={(e) => setGridOpacity(Number(e.target.value) / 100)}
                  />
                  {Math.round(gridOpacity * 100)}%
                </label>
              </>
            )}
          </div>
        </div>
        <div className="maps-container">
          <div className="map-section">
            <div className="search-box">
              <Autocomplete
                onLoad={setLeftAutocomplete}
                onPlaceChanged={onLeftPlaceChanged}
              >
                <input
                  type="text"
                  placeholder="Search location..."
                  className="search-input"
                />
              </Autocomplete>
            </div>
            <div className="map-wrapper">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={2}
                onLoad={onLeftMapLoad}
                onZoomChanged={onLeftMapZoomChanged}
                options={mapOptions}
              />
              {showGrid && gridType === 'rectangular' && (
                <div 
                  className="grid-overlay"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, ${gridOpacity}) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(0, 0, 0, ${gridOpacity}) 1px, transparent 1px)`,
                    backgroundSize: `${gridSpacing}px ${gridSpacing}px`
                  }}
                />
              )}
              {showGrid && gridType === 'circular' && generateCircularGridSVG()}
              {showCenterLines && (
                <div 
                  className="center-lines"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, ${gridOpacity}) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(0, 0, 0, ${gridOpacity}) 1px, transparent 1px)`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center'
                  }}
                />
              )}
            </div>
          </div>
          <div className="map-section">
            <div className="search-box">
              <Autocomplete
                onLoad={setRightAutocomplete}
                onPlaceChanged={onRightPlaceChanged}
              >
                <input
                  type="text"
                  placeholder="Search location..."
                  className="search-input"
                />
              </Autocomplete>
            </div>
            <div className="map-wrapper">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={2}
                onLoad={onRightMapLoad}
                onZoomChanged={onRightMapZoomChanged}
                options={mapOptions}
              />
              {showGrid && gridType === 'rectangular' && (
                <div 
                  className="grid-overlay"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, ${gridOpacity}) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(0, 0, 0, ${gridOpacity}) 1px, transparent 1px)`,
                    backgroundSize: `${gridSpacing}px ${gridSpacing}px`
                  }}
                />
              )}
              {showGrid && gridType === 'circular' && generateCircularGridSVG()}
              {showCenterLines && (
                <div 
                  className="center-lines"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, ${gridOpacity}) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(0, 0, 0, ${gridOpacity}) 1px, transparent 1px)`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </LoadScript>
  );
}

export default App; 