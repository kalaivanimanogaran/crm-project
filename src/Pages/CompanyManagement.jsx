import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, ClientSideRowModelModule, TextFilterModule, DateFilterModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, IconButton, Stack } from "@mui/material";
import CompanyForm from "../Components/CompanyForm";

// ✅ Import icons
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

// ✅ Register modules
ModuleRegistry.registerModules([ClientSideRowModelModule, TextFilterModule, DateFilterModule]);

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
  const [pageSize, setPageSize] = useState(10);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 120,
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
    
    // ✅ Add Actions column to the end
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

  // ✅ Corrected Handle Delete action
  const handleDeleteCompany = (id) => {
    const updatedData = rowData.filter((company) => company.id !== id);
    setRowData(updatedData);
    localStorage.setItem("companies", JSON.stringify(updatedData));
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
        Add New Company
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
          paginationPageSize={pageSize}
          animateRows={true}
          onGridReady={onGridReady}
        />
      </div>

      <div
        style={{
          width: "95%",
          margin: "10px auto",
          textAlign: "right",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <label>Rows per page:</label>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          style={{ padding: "5px" }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
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