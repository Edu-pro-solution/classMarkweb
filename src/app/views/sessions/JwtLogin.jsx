import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box, styled, useTheme } from "@mui/system";
import { Paragraph } from "../../../app/components/Typography";
import useAuth from "../../../app/hooks/useAuth";
import { Field, Formik } from "formik";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import pic from "./one.jpg";
import pic1 from "./two.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "./logohlhs.png";
import axios from "axios";
import pic3 from "./pic-2.png";
import { faGoogle, faApple } from "@fortawesome/free-brands-svg-icons";

import "./style.css";
import CustomLabel from "./CustomLabel";

// inital login credentials
const initialValues = {
  identifier: "",
  password: "",
};
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be 6 character length")
    .required("Password is required!"),
  // email: Yup.string()
  //   .email("Invalid Email address")
  //   .required("Email is required!"),
  // username: Yup.string()
  //   .email("Invalid Username")
  //   .required("Username is required!"),
});
const JwtLogin = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [accountSettings, setAccountSettings] = useState({
    name: "",
    motto: "",
    address: "",
    phone: "",
    phonetwo: "",
    email: "",
    sessionStart: "",
    sessionEnd: "",
    schoolLogo: "",
  });
  const apiUrl = process.env.REACT_APP_API_URL;
const handleFormSubmit = async (values) => {
  try {
    const response = await login(values.identifier, values.password);

    if (response.status === 200) {
      checkUserRoleAndRedirect();
    } else {
      toast.error("Invalid credentials");
    }
  } catch (error) {
    if (error.message === 'TOO_MANY_ATTEMPTS') {
      toast.error("Too many login attempts. Please wait 15 minutes and try again.", {
        autoClose: 8000,
      });
    } else {
      toast.error("Incorrect Username/Email or Password");
    }
  }
};
  const getUserRoleFromToken = () => {
    // Implement this function to extract the user's role from the JWT token.
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      const decodedToken = jwtDecode(jwtToken);
      return decodedToken.role;
    }
    return "guest"; // Return a default role for unauthenticated users
  };

  const checkUserRoleAndRedirect = () => {
    const userRole = getUserRoleFromToken();

    if (userRole === "admin") {
      navigate("/dashboard/admin");
    } else if (userRole === "teacher") {
      navigate("/teacher/dashboard");
    } else if (userRole === "student") {
      navigate("/student/dashboard/default");
    } else {
      navigate("/session/signin"); // Redirect unauthenticated users to sign-in page
    }
  };

  useEffect(() => {
    const fetchAccountSettings = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/account-setting`);
        const { data } = response.data;

        // Set the retrieved school settings to the state
        setAccountSettings(data);
      } catch (error) {
        console.error("Error fetching school settings:", error);
      }
    };

    fetchAccountSettings();
  }, [apiUrl]);

  return (
    <div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
      <div
        className="login-aside text-center d-flex flex-column flex-row-auto"
        // style={{ backgroundColor: "#000080 !important" }}
      >
        <div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
          <div className="text-center mb-lg-4 mb-2 pt-5 logo">
            <img
              src={`https://edupros.s3.amazonaws.com/${accountSettings.schoolLogo}`}
              style={{
                width: "200px",
                height: "130px",
              }}
            />
          </div>
          <p style={{ fontWeight: "700", fontSize: "20px", color: "white" }}>
            {" "}
            {accountSettings.name || ""}
          </p>
          <p className="mb-4" style={{ color: "white" }}>
            Welcome Back!...Login to your School Dashboard. 📚💡
            <br />
          </p>
        </div>
      </div>
      <div
        className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto"
        style={{ width: "95%" }}
      >
        <div className="d-flex justify-content-center h-100 align-items-center">
          <div className="authincation-content style-2">
            <div className="row no-gutters">
              <div className="col-xl-12 tab-content">
                <div
                  id="sign-up"
                  className="auth-form tab-pane fade show active form-validation"
                >
                  <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                  >
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
                            Sign In to
                          </h3>
                          <span>Your School Dashboard</span>
                        </div>

                        <div className="mb-3">
                          <TextField
                            fullWidth
                            type="text"
                            name="identifier"
                            label={
                              <CustomLabel label="Email or Username" required />
                            }
                            onBlur={handleBlur}
                            value={values.identifier}
                            onChange={handleChange}
                            helperText={touched.identifier && errors.identifier}
                            error={Boolean(
                              errors.identifier && touched.identifier
                            )}
                          />
                        </div>
                        <div className="mb-3">
                          <TextField
                            fullWidth
                            name="password"
                            type={showPassword ? "text" : "password"}
                            label={<CustomLabel label="Password" required />}
                            variant="outlined"
                            onBlur={handleBlur}
                            value={values.password}
                            onChange={handleChange}
                            helperText={touched.password && errors.password}
                            error={Boolean(errors.password && touched.password)}
                            sx={{ mb: 1.5 }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    edge="end"
                                  >
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
                        </div>
                        <a
                          href="/session/forgot-password"
                          className="float-end mb-4"
                          style={{
                            color: "red !important",
                            fontSize: "15px",
                            fontWeight: "800",
                          }}
                        >
                          Forgot Password?
                        </a>
                        <LoadingButton
                          type="submit"
                          color="primary"
                          loading={loading}
                          variant="contained"
                          sx={{ my: 2 }}
                          className="btn btn-block btn-primary"
                          style={{ paddingTop: "20px", paddingBottom: "20px" }}
                        >
                          Sign In
                        </LoadingButton>

                        <Paragraph>
                          <br></br>
                          Do you want to go to the home page?
                          <NavLink
                            to="https://www.edupro.com.ng"
                            style={{
                              color: theme.palette.primary.main,
                              marginLeft: 5,
                            }}
                          >
                            Home
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
      <ToastContainer />
    </div>
  );
};

export default JwtLogin;
