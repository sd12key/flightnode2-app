// AirportSelection.jsx
import React, { useEffect, useState } from "react";
import Button from "./Button";
import { GrUpdate, GrClearOption } from "react-icons/gr";
import BaseSelector from "./BaseSelector";
import "./AirportSelection.css";

export default function AirportSelection({
  airports,
  on_change,
  airportsLoading,
  reload,
}) {
  const airports_list = Array.isArray(airports) ? airports : [];

  const [code_input, set_code_input] = useState("");
  const [name_input, set_name_input] = useState("");
  const [city_input, set_city_input] = useState("");
  const [state_input, set_state_input] = useState("");
  const [dropdown_value, set_dropdown_value] = useState("");

  // Notify parent when inputs change
  useEffect(() => {
    on_change({
      city: city_input.trim(),
      state: state_input.trim(),
      code: code_input.trim(),
      name: name_input.trim(),
    });
  }, [city_input, state_input, code_input, name_input]);

  // Prefill from BaseSelector pick
  function handle_select_airport(a) {
    const id = a ? String(a.id ?? a.airportId ?? "") : "";

    set_dropdown_value(id);
    if (a) {
      set_code_input(a.code || "");
      set_name_input(a.name || "");
      set_city_input(a.city || "");
      set_state_input(a.state || "");
    }
  }

  // Reset dropdown when user types
  function handle_code_change(e) {
    set_code_input(e.target.value);
    set_dropdown_value("");
  }
  function handle_name_change(e) {
    set_name_input(e.target.value);
    set_dropdown_value("");
  }
  function handle_city_change(e) {
    set_city_input(e.target.value);
    set_dropdown_value("");
  }
  function handle_state_change(e) {
    set_state_input(e.target.value);
    set_dropdown_value("");
  }

  // Clear all
  function handle_clear_all() {
    set_code_input("");
    set_name_input("");
    set_city_input("");
    set_state_input("");
    set_dropdown_value("");
  }

  // Label helper for BaseSelector
  function getAirportLabel(a) {
    return `${a.city ?? ""}${a.state ? ", " + a.state : ""}, ${a.name ?? ""}${
      a.code ? ", " + a.code : ""
    }`;
  }

  return (
    <div className="airport-selection">
      <div className="fields-row">
        <div className="input-field-container">
          <label className="input-label" htmlFor="city-input">
            City
          </label>
          <input
            className="field input-city"
            id="city-input"
            // placeholder="City"
            value={city_input}
            onChange={handle_city_change}
          />
        </div>
        <div className="input-field-container">
          <label className="input-label" htmlFor="state-input">
            State
          </label>
          <input
            className="field input-state"
            id="state-input"
            // placeholder="State"
            value={state_input}
            onChange={handle_state_change}
          />
        </div>
        <div className="input-field-container">
          <label className="input-label" htmlFor="airport-code-input">
            Airport Code
          </label>
          <input
            id="airport-code-input"
            className="field input-airport-code"
            // placeholder="Airport code"
            value={code_input}
            onChange={handle_code_change}
          />
        </div>
        <div className="input-field-container">
          <label className="input-label" htmlFor="airport-name-input">
            Airport name
          </label>
          <input
            id="airport-name-input"
            className="field input-airport-name"
            // placeholder="Airport name"
            value={name_input}
            onChange={handle_name_change}
          />
        </div>
        <Button type="button" className="clear-btn" onClick={handle_clear_all}>
          <GrClearOption />
        </Button>
      </div>

      <div className="dropdown-row">
        <Button
          type="button"
          className="reload-btn"
          onClick={reload}
          disabled={airportsLoading}
          loading={airportsLoading}
          loadingContent={
            <span className="spinner">
              <GrUpdate />
            </span>
          }
        >
          <GrUpdate />
        </Button>
        <div className="airport-prefill-container">
          <label className="dropdown-label">Or pick to prefill</label>
          <BaseSelector
            id="airport-prefill"
            className="dropdown"
            items={airports_list}
            value={dropdown_value}
            onChange={handle_select_airport}
            getValue={(a) => a.id}
            getLabel={getAirportLabel}
            placeholder="< Airport >"
          />
        </div>
      </div>
    </div>
  );
}
