import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TextField } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const AddEditModal = ({
  open,
  setOpen,
  handlePost,
  postData,
  setPostData,
  modalAction,
  handlePut,
  errors,
  setErrors,
}) => {
  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  const hadleTextField = (field, value) => {
    setPostData((prevData) => ({ ...prevData, [field]: value }));
    setErrors((prevData) => ({ ...prevData, [field]: "" }));
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {modalAction === "Add" ? "Add new record" : "Edit record"}
        </DialogTitle>
        <DialogContent style={{ width: "550px" }}>
          <DialogContentText id="alert-dialog-slide-description">
            <TextField
              variant="standard"
              label="First Name"
              name="fname"
              value={postData.fname}
              onChange={(e) => hadleTextField(e.target.name, e.target.value)}
              error={Boolean(errors.fname)}
              helperText={errors.fname}
              fullWidth
            />

            <TextField
              variant="standard"
              label="Last Name"
              name="lname"
              value={postData.lname}
              onChange={(e) => hadleTextField(e.target.name, e.target.value)}
              className="mt-3"
              error={Boolean(errors.lname)}
              helperText={errors.lname}
              fullWidth
            />
            <TextField
              variant="standard"
              label="Age"
              name="age"
              value={postData.age}
              onChange={(e) => hadleTextField(e.target.name, e.target.value)}
              className="mt-3"
              error={Boolean(errors.age)}
              helperText={errors.age}
              fullWidth
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ marginRight: "10px" }}>
          <Button onClick={handleClose} variant="contained">
            Cancel
          </Button>
          <Button
            onClick={modalAction === "Add" ? handlePost : handlePut}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default AddEditModal;
