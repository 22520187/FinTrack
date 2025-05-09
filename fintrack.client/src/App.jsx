// import { useEffect, useState } from "react";
// import { BrowserRouter as Router } from "react-router-dom";
// import "@ant-design/v5-patch-for-react-19";
// import "./App.css";

// // You'll need to create these components
// import AllUserRoutes from "./routes/AllUserRoutes";
// import Layout from "./components/layout/layout";

// function App() {
//   return (
//     <Router>
//       <Layout>
//         <AllUserRoutes />
//       </Layout>
//     </Router>
//   );
// }

// export default App;

import { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";
import "./App.css";
import AllUserRoutes from "./routes/AllUserRoutes";

function App() {
  return (
    <Router>
      <AllUserRoutes />
    </Router>
  );
}

export default App;