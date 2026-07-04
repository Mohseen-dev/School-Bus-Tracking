export function calculateDistance(point1, point2) {
  const R = 6371; // Earth's radius in kilometers

  // Convert degrees to radians
  const lat1Rad = (point1.lat * Math.PI) / 180;
  const lat2Rad = (point2.lat * Math.PI) / 180;

  const deltaLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const deltaLon = ((point2.lon - point1.lon) * Math.PI) / 180;

  // Haversine formula
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in km
  // console.log("distannce",distance)
  return distance;
}

// --- Example Usage ---

// const sector34 = { lat: 28.5801, lon: 77.3635 };
// const sector35 = { lat: 28.5803, lon: 77.3564 };

// const distance = calculateHaversineDistance(sector34, sector35);

// console.log(`Distance: ${distance.toFixed(3)} km`);
// // Output: Distance: 0.627 km
