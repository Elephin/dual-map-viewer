import React, { useState } from 'react';
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

  return (
    <LoadScript 
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={['places', 'geometry', 'drawing']}
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
            </div>
          </div>
        </div>
      </div>
    </LoadScript>
  );
}

export default App; 