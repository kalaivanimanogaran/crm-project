import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"

function CompanyForm({ open, onClose, companyData, onSave }) {
  const [formData, setFormData] = React.useState({})
  const [errors, setErrors] = React.useState({})

  React.useEffect(() => {
    setFormData(companyData || {})
    setErrors({})
  }, [companyData])

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    setErrors({ ...errors, [field]: "" })
  }

  const validateForm = () => {
    let tempErrors = {}
    if (!formData.companyName) tempErrors.companyName = "This field is required"
    if (!formData.industry) tempErrors.industry = "This field is required"
    if (!formData.companySize) tempErrors.companySize = "This field is required"
    if (!formData.annualRevenue) tempErrors.annualRevenue = "This field is required"
    if (!formData.website) tempErrors.website = "This field is required"
    if (!formData.address) tempErrors.address = "This field is required"
    if (!formData.primaryContactPerson) tempErrors.primaryContactPerson = "This field is required"

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    onSave({
      ...formData,
      createdDate: formData.createdDate
        ? dayjs(formData.createdDate).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),
      updatedDate: formData.updatedDate
        ? dayjs(formData.updatedDate).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),
    })

    setFormData({})
    onClose()
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{companyData ? "Edit Company" : "Add New Company"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Account ID"
            fullWidth
            value={formData.id || ""}
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="Company Name"
            fullWidth
            required
            value={formData.companyName || ""}
            onChange={(e) => handleChange("companyName", e.target.value)}
            error={!!errors.companyName}
            helperText={errors.companyName}
          />
          <TextField
            margin="dense"
            label="Industry"
            fullWidth
            required
            value={formData.industry || ""}
            onChange={(e) => handleChange("industry", e.target.value)}
            error={!!errors.industry}
            helperText={errors.industry}
          />
          <TextField
            margin="dense"
            label="Company Size (Employees)"
            type="number"
            fullWidth
            required
            value={formData.companySize || ""}
            onChange={(e) => handleChange("companySize", e.target.value)}
            error={!!errors.companySize}
            helperText={errors.companySize}
          />
          <TextField
            margin="dense"
            label="Annual Revenue"
            type="number"
            fullWidth
            required
            value={formData.annualRevenue || ""}
            onChange={(e) => handleChange("annualRevenue", e.target.value)}
            error={!!errors.annualRevenue}
            helperText={errors.annualRevenue}
          />
          <TextField
            margin="dense"
            label="Website"
            fullWidth
            required
            value={formData.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            error={!!errors.website}
            helperText={errors.website}
          />
          <TextField
            margin="dense"
            label="Address (Street, City, State, Country, Pincode)"
            fullWidth
            required
            multiline
            rows={2}
            value={formData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
          />
          <TextField
            margin="dense"
            label="Primary Contact Person"
            fullWidth
            required
            value={formData.primaryContactPerson || ""}
            onChange={(e) => handleChange("primaryContactPerson", e.target.value)}
            error={!!errors.primaryContactPerson}
            helperText={errors.primaryContactPerson}
          />

          <DatePicker
            label="Created Date"
            value={formData.createdDate ? dayjs(formData.createdDate) : null}
            onChange={(newValue) => handleChange("createdDate", newValue)}
            slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
          />
          <DatePicker
            label="Updated Date"
            value={formData.updatedDate ? dayjs(formData.updatedDate) : null}
            onChange={(newValue) => handleChange("updatedDate", newValue)}
            slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} style={{ backgroundColor: "#f44336", color: "#fff" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            style={{ backgroundColor: "#4caf50", color: "#fff" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}

export default CompanyForm
