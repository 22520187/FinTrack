import { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";
import "./App.css";

// You'll need to create these components
import AllUserRoutes from "./routes/AllUserRoutes";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-bg">
      <Router>
        <Navbar />
        <AllUserRoutes />
      </Router>
    </div>
  );
}

export default App;