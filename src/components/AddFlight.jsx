import { useState, useEffect } from "react";
import { createFlight } from "../api/flightService";
import BaseSelector from "./BaseSelector";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker"; // assume you'll create it
import { mapAirlinesToAircraftOptions } from "../api/mappers";
import { mapAirportsToAirportGateOptions } from "../api/mappers";
import Button from "./Button";

export default function AddFlight({
  airlines,
  airports,
  onStartWorking,
  onStopWorking,
  airportsLoading,
  loadingAirlines,
}) {
  const [flightNumber, set_flightNumber] = useState("");
  const [aircraftSelection, set_aircraftSelection] = useState(null);
  const [departureSelection, set_departureSelection] = useState(null);
  const [arrivalSelection, set_arrivalSelection] = useState(null);
  const [departureDate, set_departureDate] = useState(null);
  const [departureTime, set_departureTime] = useState(null);
  const [arrivalDate, set_arrivalDate] = useState(null);
  const [arrivalTime, set_arrivalTime] = useState(null);
  const [statusFlight, set_statusFlight] = useState(null);
  const [loadingFlight, set_loadingFlight] = useState(false);

  const aircraftOptions = mapAirlinesToAircraftOptions(airlines);
  const airportGateOptions = mapAirportsToAirportGateOptions(airports);

  function resetAll() {
    set_flightNumber("");
    set_aircraftSelection(null);
    set_departureSelection(null);
    set_arrivalSelection(null);
    set_departureDate(null);
    set_departureTime(null);
    set_arrivalDate(null);
    set_arrivalTime(null);
  }

  useEffect(() => {
    if (!statusFlight) return;
    const t = setTimeout(() => set_statusFlight(null), 5000);
    return () => clearTimeout(t);
  }, [statusFlight]);

  async function onSubmit() {
    const ac = new AbortController();

    if (
      !flightNumber.trim() ||
      !aircraftSelection ||
      !departureSelection ||
      !arrivalSelection ||
      !flightNumber ||
      !departureDate ||
      !departureTime ||
      !arrivalDate ||
      !arrivalTime
    ) {
      set_statusFlight({
        kind: "error",
        msg: "All fields are required.",
      });
      return;
    }

    const departureLocal = `${departureDate}T${departureTime}`;
    const arrivalLocal = `${arrivalDate}T${arrivalTime}`;

    const payload = {
      flightNumber,
      departureTime: departureLocal,
      arrivalTime: arrivalLocal,
      aircraft: { id: aircraftSelection.aircraftId },
      departureAirport: { id: departureSelection.airportId },
      departureGate: { id: departureSelection.gateId },
      arrivalAirport: { id: arrivalSelection.airportId },
      arrivalGate: { id: arrivalSelection.gateId },
    };

    try {
      onStartWorking?.();
      set_loadingFlight(true);
      set_statusFlight(null);

      const response = await createFlight(payload, ac.signal);
      console.log(JSON.stringify(response, null, 2));

      set_statusFlight({
        kind: "success",
        msg: "Flight created successfully.",
      });
      resetAll();
    } catch (err) {
      if (err.name !== "AbortError") {
        const status = err.status || "unknown";
        const msg = err.message || "Unknown error";

        set_statusFlight({
          kind: "error",
          msg: `(${status}) Error creating flight.`,
        });

        console.error("Error creating flight:", status, "\n", msg);
      }
    } finally {
      set_loadingFlight(false);
      onStopWorking?.();
    }
  }

  return (
    <section className="admin-card add-flight">
      <h2>Add Flight</h2>

      <div className="admin-input-column">
        <div className="admin-input-two-item">
          <div className="input-field-container">
            <div className="admin-input-field-container">
              <label className="input-label" htmlFor="admin-add-flight-number">
                Flight Number
              </label>
              <input
                className="field input-flight-number"
                type="text"
                id="admin-add-flight-number"
                value={flightNumber}
                onChange={(e) => set_flightNumber(e.target.value)}
              />
            </div>
          </div>
          <div className="admin-input-field-container">
            <label
              className="input-label"
              htmlFor="admin-aircraft-airline-selector"
            >
              Airline and Aircraft Type
            </label>
            <BaseSelector
              id="admin-aircraft-airline-selector"
              className="admin-aircraft-selector"
              items={aircraftOptions}
              value={aircraftSelection?.aircraftId}
              onChange={set_aircraftSelection}
              disabled={loadingAirlines}
              placeholder="< Airline <-> Aircraft >"
            />
          </div>
        </div>
        <div className="admin-input-field-container">
          <label
            className="input-label"
            htmlFor="admin-departure-airport-selector"
          >
            Departure City, State, Airport, Code, Gate
          </label>
          <BaseSelector
            id="admin-departure-airport-selector"
            items={airportGateOptions}
            value={departureSelection?.gateId}
            onChange={set_departureSelection}
            disabled={airportsLoading}
            placeholder="< Departure >"
          />
        </div>
        <div className="admin-input-field-container">
          <label
            className="input-label"
            htmlFor="admin-arrival-airport-selector"
          >
            Arrival City, State, Airport, Code, Gate
          </label>
          <BaseSelector
            id="admin-arrival-airport-selector"
            items={airportGateOptions}
            value={arrivalSelection?.gateId}
            onChange={set_arrivalSelection}
            disabled={airportsLoading}
            placeholder="< Arrival >"
          />
        </div>
        <div className="admin-flight-dates-container">
          <DatePicker
            label="Departure Date"
            value={departureDate}
            onChange={set_departureDate}
          />
          <TimePicker
            label="Departure Time"
            value={departureTime}
            onChange={set_departureTime}
          />
          <DatePicker
            label="Arrival Date"
            value={arrivalDate}
            onChange={set_arrivalDate}
          />
          <TimePicker
            label="Arrival Time"
            value={arrivalTime}
            onChange={set_arrivalTime}
          />
        </div>
        <Button
          className="admin-add-flight-button"
          onClick={onSubmit}
          disabled={loadingFlight}
          loading={loadingFlight}
          loadingContent="Saving..."
        >
          Submit
        </Button>
      </div>

      {statusFlight && (
        <div className={`status ${statusFlight.kind}`}>{statusFlight.msg}</div>
      )}
    </section>
  );
}
