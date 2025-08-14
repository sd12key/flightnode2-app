import { useState } from "react";
import { useAirports } from "../hooks/useAirports";
import { useAirlines } from "../hooks/useAirlines";
import AdminRefresh from "../components/AdminRefresh";
import AddAirline from "../components/AddAirline";
import AddAircraft from "../components/AddAircraft";
import AddFlight from "../components/AddFlight";
import "./AdminPage.css";

export default function AdminPage() {
  const [workingLocal, set_workingLocal] = useState(false);

  const {
    airports,
    airportsLoading,
    airportsError,
    reload: reloadAirports,
  } = useAirports();

  const {
    airlines,
    loadingAirlines,
    errorAirlines,
    reload: reloadAirlines,
  } = useAirlines();

  const isWorking = workingLocal || airportsLoading || loadingAirlines;

  function refreshAll() {
    reloadAirports();
    reloadAirlines();
  }

  return (
    <main className="admin-main">
      <AdminRefresh loading={isWorking} onRefresh={refreshAll} />

      <AddAirline
        onStartWorking={() => set_workingLocal(true)}
        onStopWorking={() => set_workingLocal(false)}
        onAfterCreate={reloadAirlines}
      />

      <AddAircraft
        onStartWorking={() => set_workingLocal(true)}
        onStopWorking={() => set_workingLocal(false)}
        airlines={airlines}
        loadingAirlines={loadingAirlines}
        onAfterCreate={reloadAirlines}
      />

      <AddFlight
        airlines={airlines}
        airports={airports}
        onStartWorking={() => set_workingLocal(true)}
        onStopWorking={() => set_workingLocal(false)}
        airportsLoading={airportsLoading}
        loadingAirlines={loadingAirlines}
      />
    </main>
  );
}
