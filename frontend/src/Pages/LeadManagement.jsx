import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  PaginationModule,
  RowAutoHeightModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, Chip, Stack, IconButton, Box } from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";
import LeadForms from "../Components/LeadForms";

// ✅ Register all required modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  DateFilterModule,
  PaginationModule,
  RowAutoHeightModule,
]);

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

// ✅ Cell renderer for Actions using React Icons (delete issue fixed)
const ActionsCellRenderer = (params) => {
  const { data } = params;
  const onEdit = params.colDef.cellRendererParams.onEdit;
  const onDelete = params.colDef.cellRendererParams.onDelete;

  return (
    <Stack direction="row" spacing={1}>
      <IconButton aria-label="edit" size="small" onClick={() => onEdit(data)}>
        <FaEdit style={{ color: "blue" }} />
      </IconButton>
      <IconButton
        aria-label="delete"
        size="small"
        onClick={() => onDelete(data.id)} // ✅ only deletes selected row
      >
        <FaTrash style={{ color: "red" }} />
      </IconButton>
    </Stack>
  );
};

function LeadManagement() {
  const [rowData, setRowData] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [pageSize, setPageSize] = useState(10);

  // ✅ Default Column Properties
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 150,
      filter: true,
      wrapText: true,
      autoHeight: true,
    };
  }, []);

  // ✅ Column Definitions
  const [columnDefs] = useState([
    {
      headerName: "Lead ID",
      field: "id",
      minWidth: 120,
      valueGetter: (params) => {
        if (params.data && params.data.id && typeof params.data.id === "string") {
          return Number(params.data.id.slice(1));
        }
        return null;
      },
      sort: "asc",
      unSortIcon: true,
      wrapText: false,
      autoHeight: false,
    },
    { headerName: "Lead Name", field: "name", minWidth: 180 },
    { headerName: "Company", field: "company", minWidth: 200 },
    { headerName: "Contact Person", field: "contactPerson", minWidth: 180 },
    { headerName: "Mobile Number", field: "mobile", minWidth: 150 },
    { headerName: "Email", field: "email", minWidth: 200 },
    { headerName: "Status", field: "status", cellRenderer: StatusCellRenderer, minWidth: 150 },
    { headerName: "Source", field: "source", minWidth: 150 },
    { headerName: "Assigned To", field: "assignedTo", minWidth: 150 },
    { headerName: "Notes / Remarks", field: "notes", minWidth: 250 },
    { headerName: "Created Date", field: "createdDate", sort: "desc", minWidth: 150 },
    { headerName: "Updated Date", field: "updatedDate", minWidth: 150 },
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
      wrapText: false,
      autoHeight: false,
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
      updatedData = rowData.map((lead) =>
        lead.id === editingLead.id
          ? { ...lead, ...formData, updatedDate: new Date().toISOString().split("T")[0] }
          : lead
      );
    } else {
      const maxId =
        rowData.length > 0 ? Math.max(...rowData.map((l) => Number(l.id.replace("L", "")))) : 0;
      const newId = `L${String(maxId + 1).padStart(3, "0")}`;
      const newLead = {
        id: newId,
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
  const handleDeleteLead = (idToDelete) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      const updatedData = rowData.filter((lead) => lead.id !== idToDelete);
      setRowData(updatedData);
      localStorage.setItem("leads", JSON.stringify(updatedData));
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Lead Management</h2>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => setOpenForm(true)}
          sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#4caf50" } }}
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
          paginationPageSizeSelector={[5, 10, 20, 50]}
          animateRows={true}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
        />
      </div>

      <LeadForms
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingLead(null);
        }}
        leadData={editingLead}
        onSave={handleSaveLead}
      />
    </Box>
  );
}

export default LeadManagement;
