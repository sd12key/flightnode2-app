// Input: cities from /api/cities?show-airports=true
// Output: flat airports for selects/forms
export function mapCitiesToAirports(cities) {
  const out = [];

  console.log("cities before mapping", cities);

  for (const city of cities || []) {
    const cityId = city.id;
    const cityName = city.name ?? "";
    const state = city.state ?? "";
    const list = city.airports || [];

    for (const ap of list) {
      const airportId = ap.id;

      out.push({
        // ids
        airportId,
        id: airportId,
        cityId,
        city: cityName,
        state,
        // data
        code: ap.code ?? "",
        name: ap.name ?? "",

        // label for dropdowns
        label: `${cityName}${state ? ", " + state : ""}, ${ap.name}${
          ap.code ? ", " + ap.code : ""
        }`,
      });
    }
  }

  // sort alphabetically by city name
  out.sort((a, b) => a.label.localeCompare(b.label));

  console.log("cities after mapping", out);

  return out;
}

export function organizeFlightsByAirport(flights) {
  // Step 1: Collect all unique airport IDs
  const airportIds = new Set();

  // Add all arrival airports from arrivals data
  flights.arrivals.forEach((flight) => {
    airportIds.add(flight.arrivalAirport.id);
  });

  // Add all departure airports from departures data
  flights.departures.forEach((flight) => {
    airportIds.add(flight.departureAirport.id);
  });

  // Step 2: Create airport-based organization
  const result = {};

  Array.from(airportIds).forEach((airportId) => {
    result[airportId] = {
      airportInfo: null,
      arrivals: [],
      departures: [],
    };

    // Find first occurrence to get airport details
    const arrivalFlight = flights.arrivals.find(
      (f) => f.arrivalAirport.id === airportId
    );
    const departureFlight = flights.departures.find(
      (f) => f.departureAirport.id === airportId
    );

    // Set airport info from whichever flight we found
    result[airportId].airportInfo =
      arrivalFlight?.arrivalAirport || departureFlight?.departureAirport;

    // Filter and sort arrivals for this airport
    result[airportId].arrivals = flights.arrivals
      .filter((f) => f.arrivalAirport.id === airportId)
      .sort((a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime));

    // Filter and sort departures for this airport
    result[airportId].departures = flights.departures
      .filter((f) => f.departureAirport.id === airportId)
      .sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
  });

  const sortedAirports = Object.values(result).sort((a, b) => {
    return a.airportInfo.cityName
      .toLowerCase()
      .localeCompare(b.airportInfo.cityName.toLowerCase());
  });

  return sortedAirports;
}
