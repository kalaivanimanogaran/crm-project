import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, ClientSideRowModelModule, TextFilterModule, DateFilterModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, Chip, Stack, IconButton, Box } from "@mui/material";

// ✅ Import icons from react-icons
import { FaEdit, FaTrash } from "react-icons/fa"; // FaPlus is not needed if you're not using it in the button
import LeadForms from "../Components/LeadForms";

// ✅ Register community modules including the TextFilterModule
ModuleRegistry.registerModules([ClientSideRowModelModule, TextFilterModule, DateFilterModule]);

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
        <FaEdit style={{ color: "blue" }} />
      </IconButton>
      <IconButton aria-label="delete" size="small" onClick={() => onDelete(data.id)}>
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

  // ✅ Default Column Properties with filter and sortable enabled
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 150,
      filter: true, // This enables filter for all columns by default
    };
  }, []);

  // ✅ Updated Column Definitions to match LeadForms fields
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Lead ID",
      field: "id",
      minWidth: 120,
      // ✅ Use valueGetter for proper numeric sorting of IDs like 'L001', 'L002', 'L010'
      valueGetter: (params) => {
        if (params.data && params.data.id && typeof params.data.id === 'string') {
          return Number(params.data.id.slice(1));
        }
        return null;
      },
      sort: 'asc', // Automatically sort by Lead ID ascending
      unSortIcon: true // show sort icon on unsorted column
    },
    {
      headerName: "Lead Name",
      field: "name",
      minWidth: 180,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: "Company",
      field: "company",
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: "Contact Person",
      field: "contactPerson",
      minWidth: 180,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: "Mobile Number",
      field: "mobile",
      minWidth: 150,
    },
    {
      headerName: "Email",
      field: "email",
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: StatusCellRenderer,
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
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: "Notes / Remarks",
      field: "notes",
      minWidth: 250,
      wrapText: true,
      autoHeight: true,
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
      filter: false, // Explicitly disable filter for this column
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
      // Adding new lead with an automatically generated ID (L001, L002, etc.)
      // Find the maximum numeric part of the existing IDs
      const maxId = rowData.length > 0
        ? Math.max(...rowData.map((l) => Number(l.id.replace('L', ''))))
        : 0;
      
      // Generate the new ID with 'L' prefix and padded number
      const newId = `L${String(maxId + 1).padStart(3, '0')}`;
      
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

  // ✅ Corrected Handle Delete action
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
          sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#4caf50' } }} // Set button color to green
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