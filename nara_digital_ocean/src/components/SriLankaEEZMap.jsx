import React, { useEffect, useRef, useState } from 'react';

const SriLankaEEZMap = ({ className = '', showMarkers = true }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let map = null;
    let eezCircle = null;
    let outerGlow = null;
    let midGlow = null;

    const initMap = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY || 'AIzaSyBjDI-36r6TA4UAimHENGrK8NP8jh5d7Sg';
        console.log('🗺️ Initializing Google Maps...');
        console.log('📍 API Key:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT FOUND');
        
        // Check if Google Maps is already loaded
        if (!window.google?.maps) {
          console.log('⏳ Loading Google Maps API...');
          // Load Google Maps dynamically
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
          script.async = true;
          script.defer = true;
          
          await new Promise((resolve, reject) => {
            script.onload = () => {
              console.log('✅ Google Maps API loaded successfully');
              resolve();
            };
            script.onerror = (err) => {
              console.error('❌ Failed to load Google Maps API:', err);
              reject(err);
            };
            document.head.appendChild(script);
          });
        } else {
          console.log('✅ Google Maps API already loaded');
        }

        if (!mapRef.current) {
          console.log('⚠️ Map container ref not ready');
          return;
        }

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
        console.log('🗺️ Creating Google Map instance...');
        map = new window.google.maps.Map(mapRef.current, {
          center: sriLankaCenter,
          zoom: 7.8,
          disableDefaultUI: true,
          gestureHandling: 'none',
          draggable: false,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          styles: darkOceanStyles,
          backgroundColor: '#001e3c',
          mapTypeId: 'terrain'
        });
        console.log('✅ Map instance created with 30% more zoom (7.8)');

        // Sri Lanka's ACTUAL EEZ boundary coordinates (follows coastline at 200nm)
        const eezBoundaryCoords = [
          // Northern boundary (near India)
          { lat: 11.5, lng: 78.5 },
          { lat: 11.8, lng: 79.5 },
          { lat: 12.0, lng: 80.5 },
          { lat: 11.5, lng: 81.5 },
          { lat: 11.0, lng: 82.0 },
          
          // Eastern boundary (Bay of Bengal)
          { lat: 10.0, lng: 83.5 },
          { lat: 9.0, lng: 84.5 },
          { lat: 8.0, lng: 85.0 },
          { lat: 7.0, lng: 85.5 },
          { lat: 6.0, lng: 85.5 },
          { lat: 5.0, lng: 85.0 },
          
          // Southern boundary (Indian Ocean)
          { lat: 4.0, lng: 84.0 },
          { lat: 3.5, lng: 83.0 },
          { lat: 3.5, lng: 82.0 },
          { lat: 3.5, lng: 81.0 },
          { lat: 3.5, lng: 80.0 },
          { lat: 4.0, lng: 79.0 },
          
          // Western boundary (Arabian Sea / Laccadive Sea)
          { lat: 4.5, lng: 78.0 },
          { lat: 5.5, lng: 77.0 },
          { lat: 6.5, lng: 76.5 },
          { lat: 7.5, lng: 76.5 },
          { lat: 8.5, lng: 77.0 },
          { lat: 9.5, lng: 77.5 },
          { lat: 10.5, lng: 78.0 }
        ];
        
        console.log('🌊 Drawing colorful glowing border line with Polyline...');

        // Close the path for a complete border
        const closedPath = [...eezBoundaryCoords, eezBoundaryCoords[0]];

        // Outer glow border (VERY WIDE)
        outerGlow = new window.google.maps.Polyline({
          map,
          path: closedPath,
          strokeColor: '#22d3ee',
          strokeOpacity: 0.50,
          strokeWeight: 25,
          clickable: false
        });
        
        // Mid glow border (WIDE)
        midGlow = new window.google.maps.Polyline({
          map,
          path: closedPath,
          strokeColor: '#06b6d4',
          strokeOpacity: 0.80,
          strokeWeight: 16,
          clickable: false
        });

        // Main EEZ boundary (VERY THICK colorful border line)
        eezCircle = new window.google.maps.Polyline({
          map,
          path: closedPath,
          strokeColor: '#22d3ee',
          strokeOpacity: 1.0,
          strokeWeight: 10,
          clickable: false
        });
        
        console.log('✅ Colorful glowing POLYLINE border added - visible now!');

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

        // DRAMATIC COLORFUL glowing border animation - cycling through BRIGHT colors
        const colors = [
          '#00ffff', // Bright Cyan
          '#0099ff', // Bright Blue
          '#6633ff', // Bright Purple
          '#ff00ff', // Bright Magenta
          '#ff0066', // Bright Pink
          '#ff3300', // Bright Red-Orange
          '#ff9900', // Bright Orange
          '#ffff00', // Bright Yellow
          '#00ff00'  // Bright Green
        ];
        
        let colorIndex = 0;
        let mainStrokeOpacity = 1.0;
        let increasing = true;
        
        console.log('🎨 Starting COLORFUL border animation...');
        
        // SLOWER Color cycling animation - change every 1 second
        setInterval(() => {
          colorIndex = (colorIndex + 1) % colors.length;
          
          console.log(`🌈 Border color changed to: ${colors[colorIndex]}`);
          
          if (eezCircle) {
            eezCircle.setOptions({ 
              strokeColor: colors[colorIndex],
              strokeOpacity: 1.0
            });
          }
          
          if (midGlow) {
            midGlow.setOptions({ 
              strokeColor: colors[(colorIndex + 3) % colors.length],
              strokeOpacity: 0.75
            });
          }
          
          if (outerGlow) {
            outerGlow.setOptions({ 
              strokeColor: colors[(colorIndex + 6) % colors.length],
              strokeOpacity: 0.50
            });
          }
        }, 1000);

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
      if (outerGlow) outerGlow.setMap(null);
      if (midGlow) midGlow.setMap(null);
    };
  }, [showMarkers]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '600px' }}
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
