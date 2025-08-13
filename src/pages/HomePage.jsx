import React, { useState, useEffect } from "react";

import DatePicker from "../components/DatePicker";
import AirportSelection from "../components/AirportSelection";
import AirportFlightDisplay from "../components/AirportFlightDisplay";
import Button from "../components/Button";
import { useAirports } from "../hooks/useAirports";
import { handleSearchFlights } from "../utils/handleSearchFlights";
import { GrUpdate, GrSearch } from "react-icons/gr";
import "./HomePage.css";

export default function HomePage() {
  const { airports, airportsLoading, airportsError, reload } = useAirports();
  const [query, set_query] = useState({
    city: "",
    state: "",
    code: "",
    name: "",
  });
  const [startDate, set_startDate] = useState("");
  const [endDate, set_endDate] = useState("");

  const [flights, set_flights] = useState({
    departures: [],
    arrivals: [],
  });
  const [loadingFlights, set_loadingFlights] = useState(false);
  const [errorFlights, set_errorFlights] = useState(null);

  const [hasSearched, set_hasSearched] = useState(false);

  useEffect(() => {
    console.log("Flights state:", flights);
  }, [flights]);

  function handle_change(values) {
    set_query(values);
  }

  function onClickSearch() {
    console.log("Flight search button clicked");
    const ac = new AbortController();
    set_hasSearched(true);
    set_flights({
      departures: [],
      arrivals: [],
    });

    handleSearchFlights({
      query,
      startDate,
      endDate,
      setFlights: set_flights,
      setLoading: set_loadingFlights,
      setError: set_errorFlights,
      signal: ac.signal,
    });

    console.log("-->ERROR flights:", errorFlights);
    return () => ac.abort();
  }

  console.log("Flights state:", flights);

  const thereAreFlights =
    flights.departures.length > 0 || flights.arrivals.length > 0;

  // const flightsByAirport = organizeFlightsByAirport(flights);

  return (
    <>
      <nav>
        <div className="nav-selections-container">
          <div className="airport-selection-container">
            <AirportSelection
              airports={airports}
              airportsLoading={airportsLoading}
              reload={reload}
              on_change={handle_change}
            />
          </div>

          <div className="dates-container">
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={set_startDate}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={set_endDate}
            />
          </div>
        </div>
        <Button
          className="search-btn"
          onClick={onClickSearch}
          disabled={loadingFlights}
          loading={loadingFlights}
          loadingContent={
            <>
              <span className="spinner-search">
                <GrUpdate />
              </span>
              &nbsp;&nbsp;Searching...
            </>
          }
        >
          <span className="magnifying-glass">
            <GrSearch />
          </span>
          &nbsp;Search flights
        </Button>
      </nav>

      <main className="home-main">
        {(loadingFlights || airportsLoading) && (
          <h3 className="wait-for-flights">Please wait...</h3>
        )}
        {(airportsError || errorFlights) && (
          <h3 className="error-message">
            Error connecting to Flightnode API server
          </h3>
        )}

        {!hasSearched && (
          <img
            src="/airport.jpg"
            alt="Airport"
            style={{ width: "100%", maxWidth: "800px", height: "auto" }}
          />
        )}

        {/* {hasSearched && flightsLoading && (
          <div className="loading-indicator">Searching flights...</div>
        )} */}

        {hasSearched && !loadingFlights && !thereAreFlights && (
          <h3 className="flights-not-found">No flights found</h3>
        )}

        {hasSearched && !loadingFlights && !errorFlights && thereAreFlights && (
          <>
            <AirportFlightDisplay flights={flights} />
          </>
        )}
      </main>
    </>
  );
}
