import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, ClientSideRowModelModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button } from "@mui/material";
import CompanyForm from "../Components/CompanyForm";

// ✅ Register modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

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

    setColumnDefs(newColumns);
  };

  const handleSaveCompany = (formData) => {
    const newCompany = {
      id: rowData.length + 1,
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0],
      ...formData,
    };

    const updatedData = [...rowData, newCompany];
    setRowData(updatedData);
    localStorage.setItem("companies", JSON.stringify(updatedData));

    if (columnDefs.length === 0) {
      generateColumns(newCompany);
    }

    setOpenForm(false);
    setEditingCompany(null);
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
        onClick={() => setOpenForm(true)}
        style={{ margin: "10px", backgroundColor: "#4caf50", color: "#fff" }}
      >
        + Add New Company
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
