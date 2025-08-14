import { useEffect, useState } from "react";
import { getAirlinesWithAircrafts } from "../api/airlineService.js";

export function useAirlines() {
  const [airlines, set_airlines] = useState([]);
  const [loadingAirlines, set_loadingAirlines] = useState(true);
  const [errorAirlines, set_errorAirlines] = useState(null);
  const [refreshAirlines, set_refreshAirlines] = useState(0);

  useEffect(() => {
    const ac = new AbortController();
    set_loadingAirlines(true);
    set_errorAirlines(null);

    getAirlinesWithAircrafts(ac.signal)
      .then(set_airlines)
      .catch((err) => {
        if (err.name !== "AbortError") set_errorAirlines(err);
      })
      .finally(() => set_loadingAirlines(false));

    return () => ac.abort();
  }, [refreshAirlines]);

  const reload = () => set_refreshAirlines((x) => x + 1);
  return { airlines, loadingAirlines, errorAirlines, reload };
}
