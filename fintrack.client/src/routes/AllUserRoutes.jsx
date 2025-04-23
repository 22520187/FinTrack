import { Routes, Route } from "react-router-dom";
import Home from "../pages/User/Home";

function AllUserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default AllUserRoutes;