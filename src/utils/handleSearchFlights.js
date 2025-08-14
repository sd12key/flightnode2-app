import { searchFlights } from "../api/flightService";

export async function handleSearchFlights({
  query,
  startDate,
  endDate,
  setFlights,
  setLoading,
  setError,
  signal,
}) {
  setLoading(true);
  setError(null);

  try {
    const departureParams = {
      "start-date": startDate,
      "end-date": endDate,
      "departure-city": query.city,
      "departure-city-state": query.state,
      "departure-airport-name": query.name,
      "departure-airport-code": query.code,
    };

    const arrivalParams = {
      "start-date": startDate,
      "end-date": endDate,
      "arrival-city": query.city,
      "arrival-city-state": query.state,
      "arrival-airport-name": query.name,
      "arrival-airport-code": query.code,
    };

    const [departures, arrivals] = await Promise.all([
      searchFlights(departureParams, signal),
      searchFlights(arrivalParams, signal),
    ]);

    setFlights({ departures, arrivals });
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Search error:", err);
      setError(err);
    }
  } finally {
    setLoading(false);
  }
}
