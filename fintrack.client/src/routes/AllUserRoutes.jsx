// import { Routes, Route } from "react-router-dom";
// import Home from "../pages/User/Home";

// function AllUserRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       {/* Add more routes as needed */}
//     </Routes>
//   );
// }

// export default AllUserRoutes;

import { Routes, Route } from "react-router-dom";
import Home from "../pages/User/Home";
import Layout from "../components/layout/layout";
import Categories from "../pages/User/Categories";
import NotFound from "../pages/Not Found/NotFound";
import Reports from "../pages/User/Reports";
import Transactions from "../pages/User/Transactions";
import Goals from "../pages/User/Goals";
import Login from "../pages/User/Login";
import Register from "../pages/User/Register";


function AllUserRoutes() {
  return (
    <Routes>
      

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AllUserRoutes;