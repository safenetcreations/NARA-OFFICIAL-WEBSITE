import React, { useEffect, useRef, useState } from 'react';

const SriLankaEEZMap = ({ className = '', showMarkers = true }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let map = null;
    let eezCircle = null;
    let glowCircle = null;

    const initMap = async () => {
      try {
        // Check if Google Maps is already loaded
        if (!window.google?.maps) {
          // Load Google Maps dynamically
          const script = document.createElement('script');
          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY || 'AIzaSyAm7WGzLY7qM1i3pLgLhkceS1LTplYh6Lo';
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
          script.async = true;
          script.defer = true;
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        if (!mapRef.current) return;

        // Sri Lanka center coordinates
        const sriLankaCenter = { lat: 7.8731, lng: 80.7718 };
        
        // Dark ocean theme styling
        const darkOceanStyles = [
          { elementType: 'geometry', stylers: [{ color: '#0a1929' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#64b5f6' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#0a1929' }] },
          {
            featureType: 'administrative',
            elementType: 'geometry',
            stylers: [{ color: '#1e3a5f' }]
          },
          {
            featureType: 'administrative.country',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#22d3ee', weight: 1.5 }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#132f4c' }]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#1a3a52' }]
          },
          {
            featureType: 'road',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#001e3c' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#4fc3f7' }]
          }
        ];

        // Initialize map
        map = new window.google.maps.Map(mapRef.current, {
          center: sriLankaCenter,
          zoom: 6.2,
          disableDefaultUI: true,
          gestureHandling: 'none',
          draggable: false,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          styles: darkOceanStyles,
          backgroundColor: '#001e3c',
          mapTypeId: 'terrain'
        });

        // Convert 200 nautical miles to meters (1 nautical mile = 1852 meters)
        const eezRadiusMeters = 200 * 1852;

        // Outer glow circle (lighter, larger)
        glowCircle = new window.google.maps.Circle({
          map,
          center: sriLankaCenter,
          radius: eezRadiusMeters * 1.08,
          strokeWeight: 0,
          fillColor: '#06b6d4',
          fillOpacity: 0.08,
          clickable: false
        });

        // Main EEZ circle (brighter)
        eezCircle = new window.google.maps.Circle({
          map,
          center: sriLankaCenter,
          radius: eezRadiusMeters,
          strokeColor: '#22d3ee',
          strokeOpacity: 0.6,
          strokeWeight: 2,
          fillColor: '#06b6d4',
          fillOpacity: 0.18,
          clickable: false
        });

        // Add research station markers if enabled
        if (showMarkers) {
          const stations = [
            { lat: 6.9271, lng: 79.8612, name: 'Colombo Research Station' },
            { lat: 9.6615, lng: 80.0255, name: 'Jaffna Marine Lab' },
            { lat: 8.5874, lng: 81.2152, name: 'Trincomalee Station' },
            { lat: 6.0329, lng: 80.2168, name: 'Galle Monitoring Post' }
          ];

          stations.forEach(station => {
            new window.google.maps.Marker({
              position: { lat: station.lat, lng: station.lng },
              map,
              title: station.name,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: '#f97316',
                fillOpacity: 0.9,
                strokeColor: '#ffffff',
                strokeWeight: 2
              }
            });
          });
        }

        // Animate the glow with pulsing effect
        let opacity = 0.08;
        let increasing = true;
        setInterval(() => {
          if (increasing) {
            opacity += 0.002;
            if (opacity >= 0.15) increasing = false;
          } else {
            opacity -= 0.002;
            if (opacity <= 0.08) increasing = true;
          }
          if (glowCircle) {
            glowCircle.setOptions({ fillOpacity: opacity });
          }
        }, 50);

        setMapLoaded(true);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map. Please check your API key.');
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (eezCircle) eezCircle.setMap(null);
      if (glowCircle) glowCircle.setMap(null);
    };
  }, [showMarkers]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      />
      {!mapLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-300 text-sm">Loading sovereign waters...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 rounded-lg">
          <div className="text-center px-4">
            <p className="text-red-400 text-sm mb-2">{error}</p>
            <p className="text-slate-400 text-xs">Using fallback visualization</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SriLankaEEZMap;
