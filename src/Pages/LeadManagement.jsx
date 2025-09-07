// import React, { useState, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
// import { ModuleRegistry, ClientSideRowModelModule } from "ag-grid-community";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { Button } from "@mui/material";
// import LeadForms from "../Components/LeadForms";

// // Register AG Grid modules
// ModuleRegistry.registerModules([ClientSideRowModelModule]);

// function LeadManagement() {
//   const [rowData, setRowData] = useState([]);
//   const [columnDefs, setColumnDefs] = useState([]);
//   const [openForm, setOpenForm] = useState(false);
//   const [editingLead, setEditingLead] = useState(null);

//   // ✅ Load saved data from localStorage on first render
//   useEffect(() => {
//     const savedData = localStorage.getItem("leads");
//     if (savedData) {
//       const leads = JSON.parse(savedData);
//       setRowData(leads);

//       if (leads.length > 0) {
//         const fields = Object.keys(leads[0]);
//         const otherFields = fields.filter(
//           (key) => key !== "createdDate" && key !== "updatedDate"
//         );
//         const orderedFields = [...otherFields, "createdDate", "updatedDate"];
//         const newColumns = orderedFields.map((key) => ({
//           headerName: key
//             .replace(/([A-Z])/g, " $1")
//             .replace(/^./, (str) => str.toUpperCase()),
//           field: key,
//           sortable: true,
//           filter: true,
//         }));
//         setColumnDefs(newColumns);
//       }
//     }
//   }, []);

//   const handleSaveLead = (formData) => {
//     const newLead = {
//       id: rowData.length + 1,
//       createdDate: new Date().toISOString().split("T")[0],
//       updatedDate: new Date().toISOString().split("T")[0],
//       ...formData,
//     };

//     const updatedData = [...rowData, newLead];
//     setRowData(updatedData);

//     // ✅ Save to localStorage
//     localStorage.setItem("leads", JSON.stringify(updatedData));

//     // ✅ Generate columns only once
//     if (columnDefs.length === 0) {
//       const fields = Object.keys(newLead);
//       const otherFields = fields.filter(
//         (key) => key !== "createdDate" && key !== "updatedDate"
//       );
//       const orderedFields = [...otherFields, "createdDate", "updatedDate"];
//       const newColumns = orderedFields.map((key) => ({
//         headerName: key
//           .replace(/([A-Z])/g, " $1")
//           .replace(/^./, (str) => str.toUpperCase()),
//         field: key,
//         sortable: true,
//         filter: true,
//       }));
//       setColumnDefs(newColumns);
//     }

//     setOpenForm(false);
//     setEditingLead(null);
//   };

//   return (
//     <div style={{ width: "100%", height: "100vh" }}>
//       <h2 style={{ textAlign: "center" }}>Lead Management</h2>

//       <Button
//         variant="contained"
//         onClick={() => setOpenForm(true)}
//         style={{ margin: "10px", backgroundColor: "#4caf50", color: "#fff" }}
//       >
//         + Add New Lead
//       </Button>

//       <div
//         className="ag-theme-alpine"
//         style={{ height: 400, width: "95%", margin: "auto" }}
//       >
//         <AgGridReact
//           rowData={rowData}
//           columnDefs={columnDefs}
//           pagination
//           paginationPageSize={5}
//         />
//       </div>

//       <LeadForms
//         open={openForm}
//         onClose={() => {
//           setOpenForm(false);
//           setEditingLead(null);
//         }}
//         leadData={editingLead}
//         onSave={handleSaveLead}
//       />
//     </div>
//   );
// }

// export default LeadManagement;



// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { AgGridReact } from "ag-grid-react";
// import { ModuleRegistry, ClientSideRowModelModule } from "ag-grid-community";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { Button } from "@mui/material";
// import LeadForms from "../Components/LeadForms";

// // ✅ Register only community modules
// ModuleRegistry.registerModules([ClientSideRowModelModule]);

// function LeadManagement() {
//   const [rowData, setRowData] = useState([]);
//   const [columnDefs, setColumnDefs] = useState([]);
//   const [openForm, setOpenForm] = useState(false);
//   const [editingLead, setEditingLead] = useState(null);
//   const [pageSize, setPageSize] = useState(10);

//   // ✅ Default Column Properties
//   const defaultColDef = useMemo(() => {
//     return {
//       sortable: true,
//       filter: true,
//       resizable: true,
//       flex: 1,
//       minWidth: 120,
//     };
//   }, []);

//   // ✅ Load data from localStorage
//   useEffect(() => {
//     const savedData = localStorage.getItem("leads");
//     if (savedData) {
//       const leads = JSON.parse(savedData);
//       setRowData(leads);

//       if (leads.length > 0) {
//         generateColumns(leads[0]);
//       }
//     }
//   }, []);

//   // ✅ Generate Column Definitions dynamically
//   const generateColumns = (sampleLead) => {
//     const fields = Object.keys(sampleLead);
//     const otherFields = fields.filter(
//       (key) => key !== "createdDate" && key !== "updatedDate"
//     );
//     const orderedFields = [...otherFields, "createdDate", "updatedDate"];

//     const newColumns = orderedFields.map((key) => ({
//       headerName: key
//         .replace(/([A-Z])/g, " $1")
//         .replace(/^./, (str) => str.toUpperCase()),
//       field: key,
//     }));

//     setColumnDefs(newColumns);
//   };

//   // ✅ Save new lead
//   const handleSaveLead = (formData) => {
//     const newLead = {
//       id: rowData.length + 1,
//       createdDate: new Date().toISOString().split("T")[0],
//       updatedDate: new Date().toISOString().split("T")[0],
//       ...formData,
//     };

//     const updatedData = [...rowData, newLead];
//     setRowData(updatedData);
//     localStorage.setItem("leads", JSON.stringify(updatedData));

//     if (columnDefs.length === 0) {
//       generateColumns(newLead);
//     }

//     setOpenForm(false);
//     setEditingLead(null);
//   };

//   // ✅ Grid Ready Event
//   const onGridReady = useCallback((params) => {
//     params.api.sizeColumnsToFit();
//   }, []);

//   return (
//     <div style={{ width: "100%", height: "100vh" }}>
//       <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
//         Lead Management
//       </h2>

//       <Button
//         variant="contained"
//         onClick={() => setOpenForm(true)}
//         style={{ margin: "10px", backgroundColor: "#4caf50", color: "#fff" }}
//       >
//         + Add New Lead
//       </Button>

//       {/* ✅ Grid */}
//       <div
//         className="ag-theme-alpine"
//         style={{ height: "70vh", width: "95%", margin: "auto" }}
//       >
//         <AgGridReact
//           rowData={rowData}
//           columnDefs={columnDefs}
//           defaultColDef={defaultColDef}
//           pagination={true}
//           paginationPageSize={pageSize}
//           animateRows={true}
//           onGridReady={onGridReady}
//         />
//       </div>

//       {/* ✅ Pagination Controls*/}
//       <div
//         style={{
//           width: "95%",
//           margin: "10px auto",
//           textAlign: "right",
//           display: "flex",
//           justifyContent: "flex-end",
//           alignItems: "center",
//           gap: "10px",
//         }}
//       >
//         <label>Rows per page:</label>
//         <select
//           value={pageSize}
//           onChange={(e) => setPageSize(Number(e.target.value))}
//           style={{ padding: "5px" }}
//         >
//           <option value={5}>5</option>
//           <option value={10}>10</option>
//           <option value={20}>20</option>
//           <option value={50}>50</option>
//         </select>
//       </div>

//       {/* ✅ Lead Form Dialog */}
//       <LeadForms
//         open={openForm}
//         onClose={() => {
//           setOpenForm(false);
//           setEditingLead(null);
//         }}
//         leadData={editingLead}
//         onSave={handleSaveLead}
//       />
//     </div>
//   );
// }

// export default LeadManagement;
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, ClientSideRowModelModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, Chip, Stack, IconButton, Box } from "@mui/material";

// ✅ Import icons from react-icons
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import LeadForms from "../Components/LeadForms";

// ✅ Register community modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

// ✅ Cell renderer for Lead Status
const StatusCellRenderer = (params) => {
  const { value } = params;
  let color = "";
  if (value === "New") {
    color = "primary";
  } else if (value === "Contacted") {
    color = "secondary";
  } else if (value === "Qualified") {
    color = "success";
  } else if (value === "Lost") {
    color = "error";
  } else {
    color = "default";
  }
  return <Chip label={value} color={color} size="small" />;
};

// ✅ Cell renderer for Actions using React Icons
const ActionsCellRenderer = (params) => {
  const { data, onEdit, onDelete } = params;
  return (
    <Stack direction="row" spacing={1}>
      <IconButton aria-label="edit" size="small" onClick={() => onEdit(data)}>
        <FaEdit color="primary" />
      </IconButton>
      <IconButton aria-label="delete" size="small" onClick={() => onDelete(data.id)}>
        <FaTrash color="error" />
      </IconButton>
    </Stack>
  );
};

function LeadManagement() {
  const [rowData, setRowData] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [pageSize, setPageSize] = useState(10);

  // ✅ Default Column Properties with filter and sortable enabled
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 150,
    };
  }, []);

  // ✅ Updated Column Definitions to match LeadForms fields
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Lead Name",
      field: "name", // Updated to 'name'
      filter:"agTextColumnFilter",
      minWidth: 180,
    },
    {
      headerName: "Company",
      field: "company", // Updated to 'company'
      filter:"agTextColumnFilter",
      minWidth: 200,
    },
    {
      headerName: "Mobile Number",
      field: "mobile", // Updated to 'mobile'
      minWidth: 150,
    },
    {
      headerName: "Email",
      field: "email", // Updated to 'email'
      minWidth: 200,
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: StatusCellRenderer,
      filter: true,
      minWidth: 150,
    },
    {
      headerName: "Source",
      field: "source",
      minWidth: 150,
    },
    {
      headerName: "Assigned To",
      field: "assignedTo",
      minWidth: 150,
    },
    {
      headerName: "Created Date",
      field: "createdDate",
      sort: "desc",
      minWidth: 150,
    },
    {
      headerName: "Updated Date",
      field: "updatedDate",
      minWidth: 150,
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: {
        onEdit: (lead) => handleEditLead(lead),
        onDelete: (id) => handleDeleteLead(id),
      },
      sortable: false,
      filter: false,
      flex: 0,
      minWidth: 100,
      maxWidth: 100,
    },
  ]);

  // ✅ Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("leads");
    if (savedData) {
      setRowData(JSON.parse(savedData));
    }
  }, []);

  // ✅ Save or update lead
  const handleSaveLead = (formData) => {
    let updatedData;
    if (editingLead) {
      // Editing existing lead
      updatedData = rowData.map((lead) =>
        lead.id === editingLead.id ? { ...lead, ...formData, updatedDate: new Date().toISOString().split("T")[0] } : lead
      );
    } else {
      // Adding new lead
      const newLead = {
        id: rowData.length > 0 ? Math.max(...rowData.map((l) => l.id)) + 1 : 1,
        createdDate: new Date().toISOString().split("T")[0],
        updatedDate: new Date().toISOString().split("T")[0],
        status: "New",
        ...formData,
      };
      updatedData = [...rowData, newLead];
    }
    setRowData(updatedData);
    localStorage.setItem("leads", JSON.stringify(updatedData));
    setOpenForm(false);
    setEditingLead(null);
  };

  // ✅ Handle Edit action
  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setOpenForm(true);
  };

  // ✅ Handle Delete action
  const handleDeleteLead = (id) => {
    const updatedData = rowData.filter((lead) => lead.id !== id);
    setRowData(updatedData);
    localStorage.setItem("leads", JSON.stringify(updatedData));
  };

  return (
    <Box sx={{ p: 2 }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Lead Management</h2>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={() => setOpenForm(true)} 
          startIcon={<FaPlus />}
          sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }} // Set button color to green
        >
          Add New Lead
        </Button>
      </Stack>

      <div className="ag-theme-alpine" style={{ height: "70vh", width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={pageSize}
          animateRows={true}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
        />
      </div>
      
      {/* Pagination Controls moved below the grid */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
        <label>Rows per page:</label>
        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} style={{ padding: "5px", marginLeft: "8px" }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </Box>

      <LeadForms
        open={openForm}
        onClose={() => {
          setOpenForm(false)
 setEditingLead(null);
        }}
        leadData={editingLead}
        onSave={handleSaveLead}
      />
    </Box>
  );
}

export default LeadManagement;