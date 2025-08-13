import "./DatePicker.css";

export default function DatePicker({ value, onChange, label = "" }) {
  const id = label.toLowerCase().replace(/\s+/g, "-") + "-input";
  const today = new Date();
  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - 2);
  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() + 2);
  const formatDate = (date) => date.toISOString().split("T")[0];
  return (
    <div className="date-picker-container">
      {label && (
        <label htmlFor={id} className="date-label">
          {label}
        </label>
      )}
      <input
        id={id}
        type="date"
        // readOnly
        onClick={() => document.activeElement.blur()}
        value={value || ""}
        min={formatDate(minDate)}
        max={formatDate(maxDate)}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
        className="datepicker"
      />
    </div>
  );
}
