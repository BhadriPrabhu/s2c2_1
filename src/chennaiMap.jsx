import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// New softer colors for the map markers
const statusColor = (status) => {
  if (status === 'operational') return '#10b981'; // Emerald
  if (status === 'warning') return '#f59e0b';     // Amber
  if (status === 'critical') return '#f43f5e';    // Rose
  return '#94a3b8';
};

export default function ChennaiMap({ locations = [], selectedLocation, onSelectLocation }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef(L.layerGroup());

  const center = [13.0827, 80.2707];

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
        zoomControl: false, // Cleaner look
        attributionControl: false
    }).setView(center, 11);

    // Use CartoDB Positron (Light/Gray) for a very clean, professional look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    layersRef.current.addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    layersRef.current.clearLayers();

    locations.forEach(loc => {
      const isSelected = selectedLocation === loc.id;
      
      const marker = L.circleMarker([loc.lat, loc.lng], {
        radius: isSelected ? 10 : 6, // Make selected larger
        fillColor: statusColor(loc.status),
        color: '#ffffff', // White border for neatness
        weight: 3,
        opacity: 1,
        fillOpacity: 1
      });

      marker.addTo(layersRef.current);

      // Clean, white tooltip with shadow
      const tooltip = L.tooltip({ 
        permanent: isSelected, 
        direction: 'top', 
        className: 'custom-leaflet-tooltip', // You can target this in CSS if needed
        offset: [0, -12],
        opacity: 1
      })
      .setLatLng([loc.lat, loc.lng])
      .setContent(`
        <div style="text-align: center; font-family: system-ui; padding: 4px;">
          <div style="font-weight: 700; color: #1e293b; font-size: 13px;">${loc.name}</div>
          <div style="font-size: 11px; color: #64748b;">${loc.area}</div>
        </div>
      `);

      marker.bindTooltip(tooltip);
      
      if (isSelected) {
        marker.openTooltip();
        // Optional: Pan map to selected
        // mapInstanceRef.current.setView([loc.lat, loc.lng], 12); 
      }

      marker.on('click', () => onSelectLocation && onSelectLocation(loc.id));
    });

  }, [locations, selectedLocation, onSelectLocation]); 

  return (
    <div className="h-full w-full relative">
       {/* Use h-full to fill parent container */}
      <div ref={mapContainerRef} className="h-full w-full bg-gray-100" style={{ minHeight: '300px' }} />
      
      {/* Custom Legend Overlay */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-200 z-[400] text-xs">
          <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Operational</div>
          <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Warning</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Critical</div>
      </div>
    </div>
  );
}