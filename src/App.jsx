
import { Routes, Route } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import ApplicationsList from "./features/applications/ApplicationsList";
import ApplicationDetails from "./features/applications/ApplicationDetails";
import CreateApplication from "./features/applications/CreateApplication";
import EditApplication from "./features/applications/EditApplication";
import Pipeline from "./features/applications/Pipeline";
import Dashboard from "./features/applications/Dashboard";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/applications" element={<ApplicationsList />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/applications/new" element={<CreateApplication />} />
        <Route path="/applications/:id/edit" element={<EditApplication />} />
        <Route path="/applications/:id" element={<ApplicationDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
