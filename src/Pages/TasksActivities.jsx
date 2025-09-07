// import React, { useState, useEffect } from "react";
// import { Box, Typography, Paper } from "@mui/material";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

// function TasksActivities() {
//   // ✅ Initial Tasks
//   const getInitialRows = () => {
//     const savedData = localStorage.getItem("tasks");
//     return savedData ? JSON.parse(savedData) : [];
//   };

//   const [rowData, setRowData] = useState(getInitialRows);

//   // ✅ Save to localStorage whenever rowData changes
//   useEffect(() => {
//     localStorage.setItem("tasks", JSON.stringify(rowData));
//   }, [rowData]);

//   // ✅ Auto-create tasks when new leads are added
//   useEffect(() => {
//     const leadsData = localStorage.getItem("leads");
//     if (leadsData) {
//       const leads = JSON.parse(leadsData);

//       // Map leads → check if already has a task
//       const newTasks = leads
//         .filter((lead) => !rowData.some((task) => task.relatedTo === `Lead-${lead.id}`))
//         .map((lead) => ({
//           taskId: Date.now() + Math.floor(Math.random() * 1000), // unique ID
//           relatedTo: `Lead-${lead.id}`,
//           taskType: "Follow-up",
//           taskStatus: "Pending",
//         }));

//       if (newTasks.length > 0) {
//         setRowData((prev) => [...prev, ...newTasks]);
//       }
//     }
//   }, [rowData]);

//   // ✅ Table Columns
//   const columns = [
//     { headerName: "Task ID", field: "taskId", minWidth: 120, sortable: true, filter: true },
//     { headerName: "Related To", field: "relatedTo", minWidth: 200, sortable: true, filter: true },
//     { headerName: "Task Type", field: "taskType", minWidth: 150, sortable: true, filter: true },
//     { headerName: "Task Status", field: "taskStatus", minWidth: 150, sortable: true, filter: true },
//   ];

//   return (
//     <Box sx={{ padding: 4, backgroundColor: "#f1f8e9", minHeight: "100vh" }}>
//       <Typography variant="h4" textAlign="center" gutterBottom>
//         Tasks & Activities
//       </Typography>

//       <Paper sx={{ height: 500, width: "100%", padding: 1 }}>
//         <div className="ag-theme-alpine" style={{ height: "100%", width: "100%" }}>
//           <AgGridReact
//             rowData={rowData}
//             columnDefs={columns}
//             defaultColDef={{
//               minWidth: 100,
//               resizable: true,
//               sortable: true,
//               filter: true,
//             }}
//           />
//         </div>
//       </Paper>
//     </Box>
//   );
// }

// export default TasksActivities;
