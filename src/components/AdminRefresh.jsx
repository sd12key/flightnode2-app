import Button from "./Button";
import "./AdminRefresh.css";

export default function AdminRefresh({ loading, onRefresh }) {
  return (
    <div className="admin-refresh">
      <Button
        className="admin-refresh-button"
        disabled={loading}
        onClick={onRefresh}
        loading={loading}
        loadingContent="Working..."
      >
        Refresh From Database
      </Button>
    </div>
  );
}
