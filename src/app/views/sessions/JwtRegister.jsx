import { LoadingButton } from "@mui/lab";
import {
  Card,
  Checkbox,
  Grid,
  TextField,
  IconButton,
  InputAdornment,
  MenuItem,
  FormControl,
  Button,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Box, styled, useTheme } from "@mui/system";
import { Paragraph } from "../../../app/components/Typography";
import useAuth from "../../../app/hooks/useAuth";
import { Field, Formik } from "formik";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "./logohlhs.png";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./style.css";
import { jwtDecode } from "jwt-decode";
import CustomLabel from "./CustomLabel";
const apiUrl = process.env.REACT_APP_API_URL;

const FlexBox = styled(Box)(() => ({ display: "flex", alignItems: "center" }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: "center" }));

const ContentBox = styled(JustifyBox)(() => ({
  height: "100%",
  padding: "32px",
  background: "rgba(0, 0, 0, 0.01)",
}));

const JWTRegister = styled(JustifyBox)(() => ({
  background: "#000080",
  minHeight: "100vh !important",
  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center",
  },
}));

// inital login credentials
const initialValues = {
  username: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  studentName: "",
  role: "",
  AdmNo: "",
  classname: "",
  parentsName: "",
  date: "",
  sessionId: "",
  remember: true,
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    )
    .required("Password is required!"),
  email: Yup.string()
    .email("Invalid Email address")
    .required("Email is required!"),
  phone: Yup.string().matches(
    /^\d{11}$/,
    "Phone number must be exactly 11 digits"
  ),
  role: Yup.string().required("Role is required!"),
});
const roles = ["admin", "teacher", "parent", "student"]; // Define the available roles
// const sessions = []

const JwtRegister = () => {
  const theme = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Declare variables and states here
  const [classData, setClassData] = useState([]); // To store the list of classes
  const [sessionList, setSessionList] = useState([]); // To store the list of classes
  console.log(sessionList);

  const [selectedClass, setSelectedClass] = useState(""); // To store the selected class
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Assuming you have the JWT token stored in localStorage
    const token = localStorage.getItem("jwtToken");
    // Fetch classes from your API
    console.log(token)
    fetch(`https://doneapi.vercel.app/api/class`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Include your authentication token
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setClassData(data);
        console.log(data)
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
    fetch(`${apiUrl}/api/sessions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Include your authentication token
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSessionList(data);
      })
      .catch((error) => {
        console.error("Error fetching Sessions:", error);
      });
  }, []);

  const handleFormSubmit = (values) => {
    setLoading(true);

    try {
      const cleanDoubleQuotes = (str) => str.replace(/""/g, "");

      const cleanedValues = {
        role: cleanDoubleQuotes(values.role),
        username: cleanDoubleQuotes(values.username),
        email: cleanDoubleQuotes(values.email),
        phone: cleanDoubleQuotes(values.phone),
        address: cleanDoubleQuotes(values.address),
        password: cleanDoubleQuotes(values.password),
        studentName: cleanDoubleQuotes(values.studentName),
        AdmNo: cleanDoubleQuotes(values.AdmNo),
        classname: cleanDoubleQuotes(values.classname),
        parentsName: cleanDoubleQuotes(values.parentsName),
        sessionId: cleanDoubleQuotes(values.sessionId),
        date: cleanDoubleQuotes(values.date),
      };

      register({
        role: cleanedValues.role,
        username: cleanedValues.username,
        email: cleanedValues.email,
        password: cleanedValues.password,
        address: cleanedValues.address,
        phone: cleanedValues.phone,
        sessionId: cleanedValues.sessionId,
        classname: cleanedValues.classname,
        date: cleanedValues.date,
        AdmNo: cleanedValues.AdmNo,
        parentsName: cleanedValues.parentsName,
        studentName: cleanedValues.studentName
      });

      console.log("role", values.role);

      navigate("/");
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
    console.log(values);
  };
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(""); // State to hold the selected role

  return (
    <div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
      <div
        className="login-aside text-center d-flex flex-column flex-row-auto"
        style={{ backgroundColor: "#000080 !important" }}>
        <div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
          <div className="text-center mb-lg-4 mb-2 pt-5 logo"></div>
          <h3 className="mb-2 text-white">
            School Management Registration page
          </h3>
          <p className="mb-4" style={{ color: "white" }}>
            Welcome!...Sign Up first to have an account 📚💡
            <br />
          </p>
        </div>
      </div>
      <div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
        <div className="d-flex justify-content-center h-100 align-items-center">
          <div className="authincation-content style-2">
            <div className="row no-gutters">
              <div className="col-xl-12 tab-content">
                <div
                  id="sign-up"
                  className="auth-form tab-pane fade show active form-validation">
                  <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={validationSchema}>
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <div className="text-center mb-4">
                          <h3 className="text-center mb-2 text-black">
                            Create an account
                          </h3>
                        </div>

                        <TextField
                          fullWidth
                          size="small"
                          type="text"
                          name="username"
                          label={<CustomLabel label="Username" required />}
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.username}
                          id="username"
                          onChange={handleChange}
                          helperText={touched.fullname && errors.username}
                          error={Boolean(errors.fullname && touched.username)}
                          sx={{ mb: 3 }}
                        />

                        <TextField
                          fullWidth
                          size="small"
                          type="email"
                          name="email"
                          label={<CustomLabel label="Email" required />}
                          variant="outlined"
                          onBlur={handleBlur}
                          id="email"
                          value={values.email}
                          onChange={handleChange}
                          helperText={touched.email && errors.email}
                          error={Boolean(errors.email && touched.email)}
                          sx={{ mb: 3 }}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          type="text" // Use type "tel" to indicate a telephone number input
                          name="phone"
                          label={<CustomLabel label="Phone Number" />}
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.phone}
                          id="phone"
                          onChange={handleChange}
                          helperText={touched.phone && errors.phone}
                          error={Boolean(errors.phone && touched.phone)}
                          sx={{ mb: 3 }}
                          inputProps={{ pattern: "[0-9]*" }} // Allow only numeric input
                        />

                        <TextField
                          fullWidth
                          size="small"
                          type="text"
                          name="address"
                          label={<CustomLabel label="Address" />}
                          variant="outlined"
                          id="address"
                          onBlur={handleBlur}
                          value={values.address}
                          onChange={handleChange}
                          helperText={touched.address && errors.address}
                          error={Boolean(errors.address && touched.address)}
                          sx={{ mb: 3 }}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          label={<CustomLabel label="Password" required />}
                          id="password"
                          variant="outlined"
                          onBlur={handleBlur}
                          value={values.password}
                          onChange={handleChange}
                          helperText={touched.password && errors.password}
                          error={Boolean(errors.password && touched.password)}
                          sx={{ mb: 2 }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end">
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <FormControl
                          component="fieldset"
                          sx={{ mb: 3, width: "100%" }}>
                          <FormLabel component="legend">
                            <CustomLabel label="Select a Session" required />
                          </FormLabel>
                          {/*} <RadioGroup
                            name="role"
                            value={values.role}
                            onChange={handleChange}
                          >
                            {roles.map((role) => (
                              <FormControlLabel
                                key={role}
                                value={role}
                                control={<Radio />}
                                label={role}
                              />
                            ))}
                            </RadioGroup> */}

                          <TextField
                            fullWidth
                            select
                            label="Select a Session"
                            variant="outlined"
                            name="sessionId"
                            value={values.sessionId}
                            onChange={handleChange}>
                            {sessionList.map((session) => (
                              <MenuItem key={session._id} value={session._id}>
                                {session.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </FormControl>
                        <FormControl
                          component="fieldset"
                          sx={{ mb: 3, width: "100%" }}>
                          <FormLabel component="legend">
                            <CustomLabel label="Select a Role" required />
                          </FormLabel>
                          {/*} <RadioGroup
                            name="role"
                            value={values.role}
                            onChange={handleChange}
                          >
                            {roles.map((role) => (
                              <FormControlLabel
                                key={role}
                                value={role}
                                control={<Radio />}
                                label={role}
                              />
                            ))}
                            </RadioGroup> */}

                          <TextField
                            fullWidth
                            select
                            label="Select a Role"
                            variant="outlined"
                            name="role"
                            value={values.role}
                            onChange={handleChange}
                            sx={{ mb: 3 }}>
                            {roles.map((role) => (
                              <MenuItem key={role} value={role}>
                                {role}
                              </MenuItem>
                            ))}
                          </TextField>
                        </FormControl>
                        {values.role === "student" && (
                          <div>
                            <TextField
                              fullWidth
                              size="small"
                              type="text"
                              name="studentName"
                              label={
                                <CustomLabel label="Student Name" required />
                              }
                              variant="outlined"
                              onBlur={handleBlur}
                              value={values.studentName}
                              id="studentName"
                              onChange={handleChange}
                              helperText={
                                touched.studentName && errors.studentName
                              }
                              error={Boolean(
                                errors.studentName && touched.studentName
                              )}
                              sx={{ mb: 3 }}
                            />
                            <TextField
                              fullWidth
                              size="small"
                              type="text"
                              name="AdmNo"
                              label="Admission No"
                              variant="outlined"
                              onBlur={handleBlur}
                              value={values.AdmNo}
                              id="studentName"
                              onChange={handleChange}
                              helperText={touched.AdmNo && errors.AdmNo}
                              error={Boolean(errors.AdmNo && touched.AdmNo)}
                              sx={{ mb: 3 }}
                            />
                            <TextField
                              fullWidth
                              select
                              label={
                                <CustomLabel label="Select a class" required />
                              }
                              variant="outlined"
                              name="classname" // Make sure the name matches your form field
                              value={values.classname}
                              onChange={handleChange}
                              sx={{ mb: 3 }}>
                              {Array.isArray(classData) &&
                                classData.map((classItem) => (
                                  <MenuItem
                                    key={classItem._id}
                                    value={classItem.name}>
                                    {classItem.name}
                                  </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                              fullWidth
                              size="small"
                              type="text"
                              name="parentsName"
                              label={
                                <CustomLabel label="Parent Name" required />
                              }
                              variant="outlined"
                              onBlur={handleBlur}
                              value={values.parentsName}
                              id="parentsName"
                              onChange={handleChange}
                              helperText={
                                touched.parentsName && errors.parentsName
                              }
                              error={Boolean(
                                errors.parentsName && touched.parentsName
                              )}
                              sx={{ mb: 3 }}
                            />
                            <TextField
                              fullWidth
                              size="small"
                              type="date"
                              name="date"
                              label="Date of birth"
                              variant="outlined"
                              onBlur={handleBlur}
                              value={values.date}
                              id="date"
                              onChange={handleChange}
                              helperText={touched.date && errors.date}
                              error={Boolean(errors.date && touched.date)}
                              sx={{ mb: 3 }}
                            />

                            {/* Add more student-specific fields as needed */}
                          </div>
                        )}

                        {/*} <FlexBox gap={1} alignItems="center">
                          <Checkbox
                            size="small"
                            name="remember"
                            onChange={handleChange}
                            checked={values.remember}
                            sx={{ padding: 0 }}
                          />

                          <Paragraph fontSize={13}>
                            I have read and agree to the terms of service.
                          </Paragraph>
                              </FlexBox>*/}

                        <LoadingButton
                          type="submit"
                          color="primary"
                          loading={loading}
                          variant="contained"
                          sx={{ mb: 2, mt: 3 }}
                          class="btn btn-block btn-primary">
                          Register
                        </LoadingButton>

                        <Paragraph>
                          Already have an account?
                          <NavLink
                            to="/session/signin"
                            style={{
                              color: theme.palette.primary.main,
                              marginLeft: 5,
                            }}>
                            Login
                          </NavLink>
                        </Paragraph>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JwtRegister;
