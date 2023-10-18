import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import * as yup from "yup";
import AddEditModal from "./AddEditModal";

const App = () => {
  const initialValue = {
    fname: "",
    lname: "",
    age: "",
    id: "",
  };
  const [getData, setGetData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [response, setResponse] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [postData, setPostData] = useState(initialValue);
  const [errors, setErrors] = useState({});

  const schema = yup.object().shape({
    fname: yup.string().required("This field is required"),
    lname: yup.string().required("This field is required"),
    age: yup.string().required("This field is required"),
  });

  const isValid = async () => {
    try {
      await schema.validate(postData, { abortEarly: false });
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleClickOpen = (action) => {
    setModalAction(action);
    setOpen(true);
  };

  const handleGet = () => {
    axios
      .get("http://localhost:3002/api/hello")
      .then((res) => setGetData(res.data))
      .catch((err) => console.log(err));
  };

  const handlePost = async () => {
    const valid = await isValid();
    if (valid) {
      axios
        .post(`http://localhost:3002/api/hello`, postData)
        .then((res) => setResponse(res.data))
        .catch((err) => console.log(err));
      setErrors({});
    }
  };

  const handleDelete = async (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .post(`http://localhost:3002/api/hello`, { id: id })
            .then((res) => setResponse(res.data))
            .catch((err) => console.log(err));
        }
      });
  };

  const handlePut = async () => {
    const valid = await isValid();
    if (valid) {
      axios
        .put(`http://localhost:3002/api/hello`, postData)
        .then((res) => setResponse(res.data))
        .catch((err) => console.log(err));
      setErrors({});
    }
  };

  const confirmationAlert = (action) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "success",
      title: `Data ${action} successfully`,
    });
  };

  useEffect(() => {
    console.log(response);
    if (response.data === "updated") {
      confirmationAlert(response.data);
    } else if (response.data === "inserted") {
      confirmationAlert(response.data);
    } else {
      confirmationAlert(response.data);
    }
    handleGet();
    setPostData(initialValue);
    setOpen(false);
  }, [response]);

  useEffect(() => {
    handleGet();
  }, []);

  return (
    <div>
      <AddEditModal
        open={open}
        setOpen={setOpen}
        handlePost={handlePost}
        setPostData={setPostData}
        postData={postData}
        modalAction={modalAction}
        handlePut={handlePut}
        errors={errors}
        setErrors={setErrors}
      />
      <Button
        variant="outlined"
        onClick={() => {
          handleClickOpen("Add");
          setPostData(initialValue);
        }}
        style={{ marginLeft: "61%", marginTop: "10px", marginBottom: "10px" }}
      >
        Add New
      </Button>
      <table className="table table-hover">
        <thead>
          <th>Id</th>
          <th>Fname</th>
          <th>Lname</th>
          <th>Age</th>
          <th>Actions</th>
        </thead>
        <tbody>
          {getData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.fname}</td>
              <td>{item.lname}</td>
              <td>{item.age}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    handleClickOpen("Edit");
                    setPostData((prevData) => ({
                      ...prevData,
                      fname: item.fname,
                      lname: item.lname,
                      age: item.age,
                      id: item.id,
                    }));
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  style={{ marginLeft: "10px" }}
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default App;
