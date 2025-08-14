// input: airports array with .city field (from /api/airports?show-gates=true)
// output: flat airport list for home page flight search
export function mapAirportsToSelectData(airports) {
  const out = [];

  for (const ap of airports || []) {
    const cityObj = ap.city || {};
    const cityId = cityObj.id;
    const cityName = cityObj.name ?? "";
    const state = cityObj.state ?? "";
    const airportId = ap.id;

    out.push({
      airportId,
      id: airportId, // used in BaseSelector
      cityId,
      city: cityName,
      state,
      code: ap.code ?? "",
      name: ap.name ?? "",
      label: `${cityName}${state ? ", " + state : ""}, ${ap.name}${
        ap.code ? ", " + ap.code : ""
      }`,
    });
  }

  // out.sort((a, b) => a.label.localeCompare(b.label));
  // sort: city > state > airportName > code
  out.sort((a, b) => {
    const byCity = a.city.localeCompare(b.city);
    if (byCity !== 0) return byCity;

    const byState = a.state.localeCompare(b.state);
    if (byState !== 0) return byState;

    const byAirportName = a.name.localeCompare(b.name);
    if (byAirportName !== 0) return byAirportName;

    return a.code.localeCompare(b.code);
  });

  return out;
}

// input: cities from /api/cities?show-airports=true
// output: flat airports for selects/forms
// deprecated, not used in the code
export function mapCitiesToAirports(cities) {
  const out = [];

  for (const city of cities || []) {
    const cityId = city.id;
    const cityName = city.name ?? "";
    const state = city.state ?? "";
    const list = city.airports || [];

    for (const ap of list) {
      const airportId = ap.id;

      out.push({
        airportId,
        id: airportId, // used in BaseSelector
        cityId,
        city: cityName,
        state,
        code: ap.code ?? "",
        name: ap.name ?? "",
        label: `${cityName}${state ? ", " + state : ""}, ${ap.name}${
          ap.code ? ", " + ap.code : ""
        }`,
      });
    }
  }

  out.sort((a, b) => a.label.localeCompare(b.label));

  return out;
}

// input: airlines from GET /api/airlines?show-aircrafts=true
// output: sorted list for BaseSelector in AddAircraft
export function mapAirlinesToOptions(airlines) {
  return [...(airlines || [])]
    .map((a) => ({
      id: a.id,
      label: a.name ?? `Airline #${a.id}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// input: airports from /api/airports?show-gates=true
// output: flat airport gate options for BaseSelector in AddFlight
export function mapAirportsToAirportGateOptions(airports) {
  const out = [];

  for (const airport of airports || []) {
    const airportId = airport.id;
    const airportName = airport.name ?? "";
    const airportCode = airport.code ?? "";
    const gates = airport.gates || [];

    const cityName = airport.city?.name ?? "";
    const state = airport.city?.state ?? "";

    for (const gate of gates) {
      const gateId = gate.id;
      const gateName = gate.name ?? "";

      out.push({
        id: gateId, // used by BaseSelector
        gateId, // needed for payload
        airportId, // needed for payload
        airportName,
        airportCode,
        city: cityName,
        state,
        gateName,
        label: `${cityName}${state ? ", " + state : ""}, ${airportName}${
          airportCode ? " (" + airportCode + ")" : ""
        }, Gate: ${gateName}`,
      });
    }
  }

  // sort: city > state > airportName > code > gateName
  return out.sort((a, b) => {
    const byCity = a.city.localeCompare(b.city);
    if (byCity !== 0) return byCity;

    const byState = a.state.localeCompare(b.state);
    if (byState !== 0) return byState;

    const byAirportName = a.airportName.localeCompare(b.airportName);
    if (byAirportName !== 0) return byAirportName;

    const byCode = a.airportCode.localeCompare(b.airportCode);
    if (byCode !== 0) return byCode;

    return a.gateName.localeCompare(b.gateName);
  });
}

export function mapAirlinesToAircraftOptions(airlines) {
  const out = [];

  for (const airline of airlines || []) {
    const airlineName = airline.name ?? "";
    const airlineId = airline.id;

    for (const aircraft of airline.aircrafts || []) {
      const aircraftId = aircraft.id;
      const aircraftType = aircraft.type ?? "";

      out.push({
        id: aircraftId, // used in BaseSelector
        aircraftId,
        airlineId,
        airlineName,
        aircraftType,
        label: `${airlineName}, ${aircraftType}`,
      });
    }
  }

  // sort by airline name > aircraft type
  return out.sort((a, b) => {
    const nameCmp = a.airlineName.localeCompare(b.airlineName);
    if (nameCmp !== 0) return nameCmp;
    return a.aircraftType.localeCompare(b.aircraftType);
  });
}

export function organizeFlightsByAirport(flights) {
  // step 1: Collect all unique airport IDs
  const airportIds = new Set();

  // add all arrival airports from arrivals data
  flights.arrivals.forEach((flight) => {
    airportIds.add(flight.arrivalAirport.id);
  });

  // add all departure airports from departures data
  flights.departures.forEach((flight) => {
    airportIds.add(flight.departureAirport.id);
  });

  // step 2: Create airport-based organization
  const result = {};

  Array.from(airportIds).forEach((airportId) => {
    result[airportId] = {
      airportInfo: null,
      arrivals: [],
      departures: [],
    };

    // find first occurrence to get airport details
    const arrivalFlight = flights.arrivals.find(
      (f) => f.arrivalAirport.id === airportId
    );
    const departureFlight = flights.departures.find(
      (f) => f.departureAirport.id === airportId
    );

    // set airport info from whichever flight was found
    result[airportId].airportInfo =
      arrivalFlight?.arrivalAirport || departureFlight?.departureAirport;

    // filter and sort arrivals for this airport
    result[airportId].arrivals = flights.arrivals
      .filter((f) => f.arrivalAirport.id === airportId)
      .sort((a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime));

    // filter and sort departures for this airport
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
