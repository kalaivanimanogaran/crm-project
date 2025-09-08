// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { AgGridReact } from "ag-grid-react";
// import {
//   ModuleRegistry,
//   ClientSideRowModelModule,
//   TextFilterModule,
//   DateFilterModule,
//   PaginationModule,
// } from "ag-grid-community";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { Button, IconButton, Stack } from "@mui/material";
// import CompanyForm from "../Components/CompanyForm";

// // ✅ Import icons
// import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

// // ✅ Register modules
// ModuleRegistry.registerModules([
//   ClientSideRowModelModule,
//   TextFilterModule,
//   DateFilterModule,
//   PaginationModule,
// ]);

// // ✅ Cell Renderer for Actions
// const ActionsCellRenderer = (params) => {
//   const { data, onEdit, onDelete } = params;
//   return (
//     <Stack direction="row" spacing={1}>
//       <IconButton aria-label="edit" size="small" onClick={() => onEdit(data)}>
//         <FaEdit style={{ color: "blue" }} />
//       </IconButton>
//       <IconButton aria-label="delete" size="small" onClick={() => onDelete(data.id)}>
//         <FaTrash style={{ color: "red" }} />
//       </IconButton>
//     </Stack>
//   );
// };

// function CompanyManagement() {
//   const [rowData, setRowData] = useState([]);
//   const [columnDefs, setColumnDefs] = useState([]);
//   const [openForm, setOpenForm] = useState(false);
//   const [editingCompany, setEditingCompany] = useState(null);

//   const defaultColDef = useMemo(() => ({
//     sortable: true,
//     filter: true,
//  wrapText: true,    // ✅ Apply text wrapping to all columns by default
//     autoHeight: true,
//         resizable: true,
//     flex: 1,
//     minWidth: 220,
//   }), []);

//   useEffect(() => {
//     const savedData = localStorage.getItem("companies");
//     if (savedData) {
//       const companies = JSON.parse(savedData);
//       setRowData(companies);

//       if (companies.length > 0) {
//         generateColumns(companies[0]);
//       }
//     }
//   }, []);

//   const generateColumns = (sampleCompany) => {
//     const fields = Object.keys(sampleCompany);
//     const otherFields = fields.filter(
//       (key) => key !== "createdDate" && key !== "updatedDate"
//     );
//     const orderedFields = [...otherFields, "createdDate", "updatedDate"];

//     const newColumns = orderedFields.map((key) => ({
//       headerName: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
//       field: key,
//       wrapText: true,
//     }));

//     newColumns.push({
//       headerName: "Actions",
//       field: "actions",
//       cellRenderer: ActionsCellRenderer,
//       cellRendererParams: {
//         onEdit: handleEditCompany,
//         onDelete: handleDeleteCompany,
//       },
//       sortable: false,
//       filter: false,
//       flex: 0,
//       minWidth: 100,
//       maxWidth: 100,
//     });

//     setColumnDefs(newColumns);
//   };

//   const handleSaveCompany = (formData) => {
//     let updatedData;
//     if (editingCompany) {
//       updatedData = rowData.map((company) =>
//         company.id === editingCompany.id
//           ? { ...company, ...formData, updatedDate: new Date().toISOString().split("T")[0] }
//           : company
//       );
//     } else {
//       const newCompany = {
//         id: rowData.length > 0 ? Math.max(...rowData.map(c => c.id)) + 1 : 1,
//         createdDate: new Date().toISOString().split("T")[0],
//         updatedDate: new Date().toISOString().split("T")[0],
//         ...formData,
//       };
//       updatedData = [...rowData, newCompany];
//     }

//     setRowData(updatedData);
//     localStorage.setItem("companies", JSON.stringify(updatedData));

//     if (columnDefs.length === 0) {
//       generateColumns(updatedData[0]);
//     }

//     setOpenForm(false);
//     setEditingCompany(null);
//   };

//   const handleEditCompany = (company) => {
//     setEditingCompany(company);
//     setOpenForm(true);
//   };

//   // ✅ Corrected Handle Delete action with confirmation
//   const handleDeleteCompany = (id) => {
//     // Show a confirmation dialog before deleting
//     if (window.confirm("Are you sure you want to delete this record?")) {
//       const updatedData = rowData.filter((company) => company.id === id);
//       setRowData(updatedData);
//       localStorage.setItem("companies", JSON.stringify(updatedData));
//     }
//   };

//   const onGridReady = useCallback((params) => {
//     params.api.sizeColumnsToFit();
//   }, []);

//   return (
//     <div style={{ width: "100%", height: "100vh" }}>
//       <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
//         Companies Management
//       </h2>

//       <Button
//         variant="contained"
//         onClick={() => {
//           setEditingCompany(null);
//           setOpenForm(true);
//         }}
//         style={{ margin: "10px", backgroundColor: "#4caf50", color: "#fff" }}
//       >
//         <FaPlus style={{ marginRight: "8px" }} /> Add New Company
//       </Button>

//       <div
//         className="ag-theme-alpine"
//         style={{ height: "70vh", width: "95%", margin: "auto" }}
//       >
//         <AgGridReact
//           rowData={rowData}
//           columnDefs={columnDefs}
//           defaultColDef={defaultColDef}
//           pagination={true}
//           paginationPageSize={10}
//           paginationPageSizeSelector={[5, 10, 20, 50]}
//           animateRows={true}
//           onGridReady={onGridReady}
//         />
//       </div>

//       <CompanyForm
//         open={openForm}
//         onClose={() => {
//           setOpenForm(false);
//           setEditingCompany(null);
//         }}
//         companyData={editingCompany}
//         onSave={handleSaveCompany}
//       />
//     </div>
//   );
// }

// export default CompanyManagement;


import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  PaginationModule,
  // ✅ Import Row Auto Height Module
  RowAutoHeightModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, IconButton, Stack } from "@mui/material";
import CompanyForm from "../Components/CompanyForm";

// ✅ Import icons
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

// ✅ Register modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  PaginationModule,
  RowAutoHeightModule, // ✅ Register the Row Auto Height Module
]);

// ✅ Cell Renderer for Actions
const ActionsCellRenderer = (params) => {
  const { data, onEdit, onDelete } = params;
  return (
    <Stack direction="row" spacing={1}>
      <IconButton aria-label="edit" size="small" onClick={() => onEdit(data)}>
        <FaEdit style={{ color: "blue" }} />
      </IconButton>
      <IconButton aria-label="delete" size="small" onClick={() => onDelete(data.id)}>
        <FaTrash style={{ color: "red" }} />
      </IconButton>
    </Stack>
  );
};

function CompanyManagement() {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 220,
    wrapText: true,    // ✅ Apply text wrapping to all columns by default
    autoHeight: true,  // ✅ Enable auto-height for rows based on text content
  }), []);

  useEffect(() => {
    const savedData = localStorage.getItem("companies");
    if (savedData) {
      const companies = JSON.parse(savedData);
      setRowData(companies);

      if (companies.length > 0) {
        generateColumns(companies[0]);
      }
    }
  }, []);

  const generateColumns = (sampleCompany) => {
    const fields = Object.keys(sampleCompany);
    const otherFields = fields.filter(
      (key) => key !== "createdDate" && key !== "updatedDate"
    );
    const orderedFields = [...otherFields, "createdDate", "updatedDate"];

    const newColumns = orderedFields.map((key) => ({
      headerName: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
      field: key,
    }));

    newColumns.push({
      headerName: "Actions",
      field: "actions",
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: {
        onEdit: handleEditCompany,
        onDelete: handleDeleteCompany,
      },
      sortable: false,
      filter: false,
      flex: 0,
      minWidth: 100,
      maxWidth: 100,
    });

    setColumnDefs(newColumns);
  };

  const handleSaveCompany = (formData) => {
    let updatedData;
    if (editingCompany) {
      updatedData = rowData.map((company) =>
        company.id === editingCompany.id
          ? { ...company, ...formData, updatedDate: new Date().toISOString().split("T")[0] }
          : company
      );
    } else {
      const newCompany = {
        id: rowData.length > 0 ? Math.max(...rowData.map(c => c.id)) + 1 : 1,
        createdDate: new Date().toISOString().split("T")[0],
        updatedDate: new Date().toISOString().split("T")[0],
        ...formData,
      };
      updatedData = [...rowData, newCompany];
    }

    setRowData(updatedData);
    localStorage.setItem("companies", JSON.stringify(updatedData));

    if (columnDefs.length === 0) {
      generateColumns(updatedData[0]);
    }

    setOpenForm(false);
    setEditingCompany(null);
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setOpenForm(true);
  };

  const handleDeleteCompany = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      const updatedData = rowData.filter((company) => company.id !== id);
      setRowData(updatedData);
      localStorage.setItem("companies", JSON.stringify(updatedData));
    }
  };

  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        Companies Management
      </h2>

      <Button
        variant="contained"
        onClick={() => {
          setEditingCompany(null);
          setOpenForm(true);
        }}
        style={{ margin: "10px", backgroundColor: "#4caf50", color: "#fff" }}
      >
        <FaPlus style={{ marginRight: "8px" }} /> Add New Company
      </Button>

      <div
        className="ag-theme-alpine"
        style={{ height: "70vh", width: "95%", margin: "auto" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20, 50]}
          animateRows={true}
          onGridReady={onGridReady}
        />
      </div>

      <CompanyForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingCompany(null);
        }}
        companyData={editingCompany}
        onSave={handleSaveCompany}
      />
    </div>
  );
}

export default CompanyManagement;