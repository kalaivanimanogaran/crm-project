import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"

function LeadForms({ open, onClose, leadData, onSave }) {
  const [formData, setFormData] = React.useState(leadData || {})
  const [errors, setErrors] = React.useState({})

  React.useEffect(() => {
    setFormData(leadData || {})
    setErrors({})
  }, [leadData])

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    setErrors({ ...errors, [field]: "" })
  }

  const validateForm = () => {
    let tempErrors = {}
    if (!formData.name) tempErrors.name = "This field is required"
    if (!formData.company) tempErrors.company = "This field is required"
    if (!formData.mobile) tempErrors.mobile = "This field is required"
    if (!formData.email) {
      tempErrors.email = "This field is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Enter a valid email with @"
    }
    if (!formData.source) tempErrors.source = "This field is required"
    if (!formData.status) tempErrors.status = "This field is required"
    if (!formData.assignedTo) tempErrors.assignedTo = "This field is required"
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
    onClose()
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{leadData ? "Edit Lead" : "Add New Lead"}</DialogTitle>
        <DialogContent>
          {/* Lead ID */}
          <TextField
            margin="dense"
            label="Lead ID"
            fullWidth
            value={formData.id || ""}
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            margin="dense"
            label="Lead Name"
            fullWidth
            required
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="dense"
            label="Company Name"
            fullWidth
            required
            value={formData.company || ""}
            onChange={(e) => handleChange("company", e.target.value)}
            error={!!errors.company}
            helperText={errors.company}
          />
          <TextField
            margin="dense"
            label="Contact Person"
            fullWidth
            value={formData.contactPerson || ""}
            onChange={(e) => handleChange("contactPerson", e.target.value)}
          />
          <TextField
            margin="dense"
            label="Mobile Number"
            fullWidth
            required
            value={formData.mobile || ""}
            onChange={(e) => handleChange("mobile", e.target.value)}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
            }
            error={!!errors.mobile}
            helperText={errors.mobile}
          />
          <TextField
            margin="dense"
            label="Email ID"
            type="email"
            fullWidth
            required
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="dense"
            select
            label="Lead Source"
            fullWidth
            required
            value={formData.source || ""}
            onChange={(e) => handleChange("source", e.target.value)}
            error={!!errors.source}
            helperText={errors.source}
          >
            <MenuItem value="Website">Website</MenuItem>
            <MenuItem value="Referral">Referral</MenuItem>
            <MenuItem value="Call">Call</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            select
            label="Lead Status"
            fullWidth
            required
            value={formData.status || ""}
            onChange={(e) => handleChange("status", e.target.value)}
            error={!!errors.status}
            helperText={errors.status}
          >
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Contacted">Contacted</MenuItem>
            <MenuItem value="Qualified">Qualified</MenuItem>
            <MenuItem value="Lost">Lost</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Assigned To"
            fullWidth
            required
            value={formData.assignedTo || ""}
            onChange={(e) => handleChange("assignedTo", e.target.value)}
            error={!!errors.assignedTo}
            helperText={errors.assignedTo}
          />
          <TextField
            margin="dense"
            label="Notes / Remarks"
            multiline
            rows={3}
            fullWidth
            value={formData.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
          />

          {/* Date Pickers */}
          <DatePicker
            label="Created Date"
            value={formData.createdDate ? dayjs(formData.createdDate) : dayjs()}
            onChange={(newValue) => handleChange("createdDate", newValue)}
            slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
          />
          <DatePicker
            label="Updated Date"
            value={formData.updatedDate ? dayjs(formData.updatedDate) : dayjs()}
            onChange={(newValue) => handleChange("updatedDate", newValue)}
            slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            style={{ backgroundColor: "#4caf50", color: "#fff" }}
          >
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

export default LeadForms
