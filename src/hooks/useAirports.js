// src/hooks/useAirports.js
import { useEffect, useState } from "react";
import { getAirportsWithCities } from "../api/airportService";
import { mapAirportsToSelectData } from "../api/mappers";

export function useAirports() {
  const [airports, set_airports] = useState([]);
  const [airportsLoading, set_airportsLoading] = useState(true);
  const [airportsError, set_airportsError] = useState(null);
  const [refreshAirports, set_refreshAirports] = useState(0);

  useEffect(() => {
    const ac = new AbortController();
    set_airportsLoading(true);
    set_airportsError(null);

    getAirportsWithCities(ac.signal)
      .then((airports) => set_airports(airports))
      .catch((err) => {
        if (err.name !== "AbortError") set_airportsError(err);
      })
      .finally(() => set_airportsLoading(false));

    return () => ac.abort();
  }, [refreshAirports]);

  const reload = () => set_refreshAirports((x) => x + 1);

  return { airports, airportsLoading, airportsError, reload };
}
