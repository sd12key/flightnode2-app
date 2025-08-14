import "./TimePicker.css";

export default function TimePicker({ value, onChange, label = "" }) {
  const id = label.toLowerCase().replace(/\s+/g, "-") + "-time-input";
  return (
    <div className="timepicker-container">
      {label && (
        <label htmlFor={id} className="time-label">
          {label}
        </label>
      )}
      <input
        id={id}
        type="time"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="timepicker"
        onKeyDown={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
      />
    </div>
  );
}
