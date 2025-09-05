import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, ClientSideRowModelModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button } from "@mui/material";
import LeadForms from "../Components/LeadForms";

// Register AG Grid modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

function LeadManagement() {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const handleSaveLead = (formData) => {
    const newLead = {
      id: rowData.length + 1,
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0],
      ...formData,
    };

    setRowData((prev) => [...prev, newLead]);

    // Generate columns only once
    if (columnDefs.length === 0) {
      const fields = Object.keys(newLead);

      // Exclude createdDate and updatedDate from the main array
      const otherFields = fields.filter(
        (key) => key !== "createdDate" && key !== "updatedDate"
      );

      // Add createdDate & updatedDate at the end
      const orderedFields = [...otherFields, "createdDate", "updatedDate"];

      const newColumns = orderedFields.map((key) => ({
        headerName: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        field: key,
      }));

      setColumnDefs(newColumns);
    }

    setOpenForm(false);
    setEditingLead(null);
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <h2 style={{ textAlign: "center" }}>Lead Management</h2>

      <Button
        variant="contained"
        onClick={() => setOpenForm(true)}
        style={{ margin: "10px", backgroundColor: "#4caf50", color: "#fff" }}
      >
        + Add New Lead
      </Button>

      <div
        className="ag-theme-alpine"
        style={{ height: 400, width: "95%", margin: "auto" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination
          paginationPageSize={5}
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
    </div>
  );
}

export default LeadManagement;


