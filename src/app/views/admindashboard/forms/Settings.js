import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { MenuItem, Select, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { Breadcrumb, SimpleCard } from "../../../../app/components";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  Button,
  Checkbox,
  Grid,
  Icon,
  DialogTitle,
  styled,
  IconButton,
  InputAdornment,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Span } from "../../../../app/components/Typography";
import { useEffect, useState, useContext } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Navigate, useNavigate } from "react-router-dom";
import { SessionContext } from "../../../components/MatxLayout/Layout1/SessionContext";
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const Settings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    motto: "",
    address: "", // Change to match the server's expected field name
    phone: "",
    phonetwo: "",
    currency: "",
    email: "",
    sessionStart: "",
    sessionEnd: "",
    schoolLogo: null,
  });
const { currentSession } = useContext(SessionContext);

  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    // Fetch classes from your API
    fetch(`${apiUrl}/api/class`)
      .then((response) => response.json())
      .then((data) => {
        // Handle class data if needed
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("motto", formData.motto);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("phonetwo", formData.phonetwo);
    formDataToSend.append("currency", formData.currency);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("sessionStart", formData.sessionStart); // Adjusted field name
    formDataToSend.append("sessionEnd", formData.sessionEnd); // Adjusted field name
    console.log("FormData before append:", formDataToSend);
  if (currentSession?._id) {
    formDataToSend.append("session", currentSession._id);
  } else {
    toast.error("No active session found!");
    return;
  }
    if (formData.schoolLogo) {
      formDataToSend.append("schoolLogo", formData.schoolLogo);
    }

    try {
      await axios.post(`${apiUrl}/api/account-setting`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
      console.log("FormData after append:", formDataToSend);

      toast.success("School profile updated successfully");
    } catch (err) {
      console.error("Error updating school profile:", err);
      toast.error("Unable to update school profile");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: files ? files[0] : value, // Handle files separately
    }));
  };
  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;

  //   if (name === "schoolLogo") {
  //     const logoFile = files[0];
  //     const newFormData = new FormData();
  //     newFormData.append("schoolLogo", logoFile);

  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       [name]: logoFile,
  //     }));
  //   } else {
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       [name]: value,
  //     }));
  //   }
  // };

  return (
    <div>
      <Container>
        <Stack spacing={3}>
          <SimpleCard>
            <DialogTitle id="form-dialog-title"> System Setting</DialogTitle>

            <ValidatorForm onSubmit={handleSubmit}>
              <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <label>Name of School</label>
                  <TextField
                    fullWidth
                    autoFocus
                    margin="dense"
                    size="small"
                    type="text"
                    name="name"
                    placeholder="Name of your school"
                    label="Full Name"
                    variant="outlined"
                    value={formData.name}
                    id="name"
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                  />
                  <label>Your school Motto</label>
                  <TextField
                    fullWidth
                    autoFocus
                    margin="dense"
                    size="small"
                    type="text"
                    name="motto"
                    placeholder="Enter the motto"
                    label="Full Name"
                    variant="outlined"
                    value={formData.motto}
                    id="motto"
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                  />
                  <label>School Address</label>
                  <TextField
                    fullWidth
                    size="small"
                    type="text"
                    name="address"
                    label="School Address"
                    variant="outlined"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                  />
                  <label>Phone Number</label>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    name="phone"
                    variant="outlined"
                    value={formData.phone}
                    id="phone"
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                  />
                  <label>Additional Phone number if there is </label>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    name="phonetwo"
                    variant="outlined"
                    value={formData.phonetwo}
                    id="phonetwo"
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                  />
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <label>Currency </label>
                  <TextField
                    fullWidth
                    size="small"
                    type="text"
                    name="currency"
                    variant="outlined"
                    value={formData.currency}
                    id="currency"
                    placeholder="NGN"
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                  />
                  <label>School Email </label>
                  <TextField
                    fullWidth
                    size="small"
                    type="email"
                    name="email"
                    variant="outlined"
                    value={formData.email}
                    id="email"
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                  />
                  <label>Running Session </label>
                  <br></br>
                  <label>Start Session </label>
                  <TextField
                    fullWidth
                    size="small"
                    type="text"
                    name="sessionStart"
                    variant="outlined"
                    value={formData.sessionStart}
                    id="sessionStart"
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                  />
                  <label>End Session </label>
                  <TextField
                    fullWidth
                    size="small"
                    type="text"
                    name="sessionEnd"
                    variant="outlined"
                    value={formData.sessionEnd}
                    id="sessionEnd"
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                  />
                  <label>School Logo</label>
                  <input
                    type="file"
                    name="schoolLogo"
                    // value={formData.schoolLogo}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                  />
                </Grid>
              </Grid>
              <Button color="primary" variant="contained" type="submit">
                <Icon>send</Icon>
                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</Span>
              </Button>
            </ValidatorForm>
          </SimpleCard>
        </Stack>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Settings;
