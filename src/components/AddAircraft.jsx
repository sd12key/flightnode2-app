import { useState, useEffect } from "react";
import Button from "./Button";
import BaseSelector from "./BaseSelector";
import { createAircraft } from "../api/aircraftService";
import { mapAirlinesToOptions } from "../api/mappers";

export default function AddAircraft({
  onStartWorking,
  onStopWorking,
  airlines,
  loadingAirlines,
  onAfterCreate,
}) {
  const [aircraftType, set_aircraftType] = useState("");
  const [capacity, set_capacity] = useState("");
  const [selectedAirline, set_selectedAirline] = useState(null);
  const [loadingAircraft, set_loadingAircraft] = useState(false);
  const [statusAircraft, set_statusAircraft] = useState(null);

  const airlineOptions = mapAirlinesToOptions(airlines);

  useEffect(() => {
    if (!airlines.some((a) => a.id === selectedAirline?.id)) {
      set_selectedAirline(null);
    }
  }, [airlines]);

  useEffect(() => {
    if (!statusAircraft) return;
    const t = setTimeout(() => set_statusAircraft(null), 5000);
    return () => clearTimeout(t);
  }, [statusAircraft]);

  function resetAll() {
    set_aircraftType("");
    set_capacity("");
    set_selectedAirline(null);
  }

  async function onSubmit() {
    if (!aircraftType.trim() || !selectedAirline || !capacity) {
      set_statusAircraft({ kind: "error", msg: "All fields are required." });
      return;
    }

    const ac = new AbortController();
    try {
      onStartWorking?.();
      set_loadingAircraft(true);
      set_statusAircraft(null);

      const payload = {
        type: aircraftType.trim(),
        capacity: parseInt(capacity),
        airline: { id: selectedAirline.id },
      };

      const response = await createAircraft(payload, ac.signal);
      console.log(JSON.stringify(response, null, 2));

      set_statusAircraft({
        kind: "success",
        msg: "Aircraft created successfully.",
      });
      onAfterCreate?.();

      resetAll();
    } catch (err) {
      if (err.name !== "AbortError") {
        const status = err.status || "unknown";
        const msg = err.message || "Unknown error";

        set_statusAircraft({
          kind: "error",
          msg: `(${status}) Error creating aircraft.`,
        });

        console.error("Error creating aircraft:", status, "\n", msg);
      }
    } finally {
      set_loadingAircraft(false);
      onStopWorking?.();
    }
  }

  return (
    <section className="admin-card add-aircraft">
      <h2>Add Aircraft</h2>
      <div className="admin-input-column">
        <div className="admin-input-two-item">
          <div className="admin-input-field-container">
            <label className="input-label" htmlFor="aircraft-type-input">
              Aircraft Type
            </label>
            <input
              id="aircraft-type-input"
              className="field aircraft-type-input"
              value={aircraftType}
              type="text"
              onChange={(e) => set_aircraftType(e.target.value)}
            />
          </div>
          <div className="admin-input-field-container">
            <label className="input-label" htmlFor="aircraft-capacity-input">
              Capacity
            </label>
            <input
              id="aircraft-capacity-input"
              className="field capacity-input"
              type="number"
              min="1"
              max="1000"
              value={capacity}
              onChange={(e) => set_capacity(e.target.value)}
            />
          </div>
        </div>
        <div className="admin-input-field-container">
          <label className="input-label" htmlFor="aircraft-airline-selector">
            Select Airline
          </label>
          <BaseSelector
            id="aircraft-airline-selector"
            items={airlineOptions}
            value={selectedAirline?.id}
            onChange={set_selectedAirline}
            disabled={loadingAirlines}
            placeholder="< Airline >"
          />
        </div>
        <Button
          className="admin-add-aircraft-button"
          onClick={onSubmit}
          disabled={loadingAircraft}
          loading={loadingAircraft}
          loadingContent="Saving..."
        >
          Submit
        </Button>
      </div>

      {statusAircraft && (
        <div className={`status ${statusAircraft.kind}`}>
          {statusAircraft.msg}
        </div>
      )}
    </section>
  );
}
