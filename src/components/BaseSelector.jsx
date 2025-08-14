import React from "react";
import "./BaseSelector.css";

/**
 * Generic dropdown selector
 * Props:
 * - id: string
 * - className?: string
 * - items: any[]                            // array of domain items
 * - value: string | number | null | undefined  // selected id
 * - onChange: (item | null) => void         // emits the selected item (or null if cleared)
 * - getValue?: (item) => string|number      // defaults to item.id
 * - getLabel?: (item) => string             // defaults to item.label || item.name || String(item.id)
 * - placeholder?: string                    // default: "— Select —"
 * - disabled?: boolean
 */
export default function BaseSelector({
  id,
  className = "",
  items = [],
  value,
  onChange,
  getValue = (item) => item?.id,
  getLabel = (item) => item?.label ?? item?.name ?? String(item?.id ?? ""),
  placeholder = "— Select —",
  disabled = false,
}) {
  const currentValue =
    value === null || value === undefined ? "" : String(value);

  function handleChange(e) {
    const v = e.target.value;
    if (v === "") {
      onChange?.(null);
      return;
    }
    const picked = items.find((it) => String(getValue(it)) === v) ?? null;
    onChange?.(picked);
  }

  return (
    <select
      id={id}
      className={`base-selector ${className}`}
      value={currentValue}
      onChange={handleChange}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {items.map((it) => {
        const optValue = String(getValue(it));
        const label = getLabel(it);
        return (
          <option key={optValue} value={optValue}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
