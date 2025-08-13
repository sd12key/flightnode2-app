// src/hooks/useAirports.js
import { useEffect, useState } from "react";
import { getCitiesWithAirports } from "../api/cityService";
import { mapCitiesToAirports } from "../api/mappers";

export function useAirports() {
  const [airports, set_airports] = useState([]);
  const [airportsLoading, set_airportsLoading] = useState(true);
  const [airportsError, set_airportsError] = useState(null);
  const [refresh, set_refresh] = useState(0); // 👈 trigger

  useEffect(() => {
    const ac = new AbortController();
    set_airportsLoading(true);
    set_airportsError(null);

    getCitiesWithAirports(ac.signal)
      .then((cities) => set_airports(mapCitiesToAirports(cities)))
      .catch((err) => {
        if (err.name !== "AbortError") set_airportsError(err);
      })
      .finally(() => set_airportsLoading(false));

    return () => ac.abort();
  }, [refresh]);

  const reload = () => set_refresh((x) => x + 1);

  return { airports, airportsLoading, airportsError, reload };
}
