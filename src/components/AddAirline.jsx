import { useState, useEffect } from "react";
import Button from "./Button";
import { createAirline } from "../api/airlineService";

export default function AddAirline({
  onStartWorking,
  onStopWorking,
  onAfterCreate,
}) {
  const [nameAirline, set_nameAirline] = useState("");
  const [loadingAirlines, set_loadingAirlines] = useState(false);
  const [statusAirlines, set_statusAirlines] = useState(null);

  useEffect(() => {
    if (!statusAirlines) return;
    const t = setTimeout(() => set_statusAirlines(null), 5000);
    return () => clearTimeout(t);
  }, [statusAirlines]);

  async function onSubmit() {
    if (!nameAirline.trim()) {
      set_statusAirlines({
        kind: "error",
        msg: "Airline name cannot be empty.",
      });
      return;
    }
    const ac = new AbortController();
    try {
      onStartWorking?.();
      set_loadingAirlines(true);
      set_statusAirlines(null);

      const response = await createAirline(nameAirline.trim(), ac.signal);
      console.log(JSON.stringify(response, null, 2));

      set_statusAirlines({
        kind: "success",
        msg: "Airline created successfully.",
      });
      resetAll();
      onAfterCreate?.();
    } catch (err) {
      if (err.name !== "AbortError") {
        const status = err.status || "unknown";
        const msg = err.message || "Unknown error";

        set_statusAirlines({
          kind: "error",
          msg: `(${status}) Error creating airline.`,
        });

        console.error("Error creating airline:", status, "\n", msg);
      }
    } finally {
      set_loadingAirlines(false);
      onStopWorking?.();
    }
  }

  function resetAll() {
    set_nameAirline("");
  }

  return (
    <section className="admin-card add-airline">
      <h2>Add Airline</h2>
      <div className="admin-input-column">
        <div className="admin-input-field-container">
          <label className="input-label" htmlFor="airline-name-input">
            Airline Name
          </label>
          <input
            id="airline-name-input"
            className="field admin-airline-name"
            value={nameAirline}
            onChange={(e) => set_nameAirline(e.target.value)}
            type="text"
          />
        </div>
        <Button
          className="admin-add-airline-button"
          onClick={onSubmit}
          disabled={loadingAirlines}
          loading={loadingAirlines}
          loadingContent="Saving..."
        >
          Submit
        </Button>
      </div>
      {statusAirlines && (
        <div className={`status ${statusAirlines.kind}`}>
          {statusAirlines.msg}
        </div>
      )}
    </section>
  );
}
