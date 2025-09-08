// import React from 'react'
// import LeadManagement from './Pages/LeadManagement'

// function App() {
//   return (
//     <div>
//       <LeadManagement/>
      
//       </div>
//   )
// }

// export default App

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LeadManagement from "./Pages/LeadManagement";
import CompanyManagement from "./Pages/CompanyManagement";
// import TasksActivities from "./Pages/TasksActivities"; // ✅ import task module

function App() {
  return (
    <Router>
      <div>
        {/* ✅ Navigation Menu */}
        <nav style={{ padding: "10px", backgroundColor: "#f5f5f5" }}>
          <Link to="/leads" style={{ marginRight: "20px" }}>
            Leads
          </Link>
          <Link to="/companies" style={{ marginRight: "20px" }}>
            Companies
          </Link>
          {/* <Link to="/tasks">Tasks & Activities</Link> ✅ new menu */}
        </nav>

        {/* ✅ Page Routes */}
        <Routes>
          <Route path="/" element={<LeadManagement />} />
          <Route path="/leads" element={<LeadManagement />} />
          <Route path="/companies" element={<CompanyManagement />} />
          {/* <Route path="/tasks" element={<TasksActivities />} /> ✅ new route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
