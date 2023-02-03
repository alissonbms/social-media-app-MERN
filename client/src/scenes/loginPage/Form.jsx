import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";

import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import {
  useRegisterUserMutation,
  useLoginUserMutation,
} from "features/apiSlice";
import CustomImage from "components/CustomImage";

const registerSchema = yup.object().shape({
  firstName: yup.string("Invalid").required("field required"),
  lastName: yup.string("Invalid").required("field required"),
  email: yup
    .string("Invalid")
    .email("Invalid email")
    .required("field required"),
  password: yup.string("Invalid").required("field required"),
  location: yup.string("Invalid"),
  occupation: yup.string("Invalid"),
  picture: yup.string("Invalid"),
});

const loginSchema = yup.object().shape({
  firstName: yup.string("Invalid").required("field required"),
  email: yup
    .string("Invalid")
    .email("Invalid email")
    .required("field required"),
  password: yup.string("Invalid").required("field required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  firstName: "",
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("register");
  const [picturePreview, setPicturePreview] = useState("");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [registerUser] = useRegisterUserMutation();
  const [loginUser] = useLoginUserMutation();

  const register = async (values, onSubmitProps) => {
    //FormData allows us to pass a file image
    const formData = new FormData();

    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("location", values.location);
    formData.append("occupation", values.occupation);
    formData.append("pictureFile", values.picture);
    formData.append("pictureType", "profile");

    const savedUser = await registerUser(formData).unwrap();

    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedIn = await loginUser(values).unwrap();

    onSubmitProps.resetForm();

    if (loggedIn) {
      dispatch(
        setLogin({
          token: loggedIn.token,
          user: loggedIn.user,
        })
      );
      navigate("/home", { replace: true });
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              label="First Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.firstName}
              name="firstName"
              sx={{ gridColumn: `${isLogin ? "span 4" : "span 2"}` }}
              error={Boolean(touched.firstName) && Boolean(errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            {isRegister && (
              <>
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  sx={{ gridColumn: "span 2" }}
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) => {
                      setFieldValue("picture", acceptedFiles[0]);
                      setPicturePreview(acceptedFiles[0]);
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />

                        {!values.picture ? (
                          <p>Add your picture profile here</p>
                        ) : (
                          <FlexBetween>
                            <Box display="flex" gap="10px" alignItems="center">
                              <CustomImage
                                alt="user profile picture"
                                imageUrl={URL.createObjectURL(picturePreview)}
                              />
                              <Typography>{values.picture.name}</Typography>
                            </Box>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  sx={{ gridColumn: "span 2" }}
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  sx={{ gridColumn: "span 2" }}
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                />
              </>
            )}
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              sx={{ gridColumn: "span 4" }}
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              sx={{ gridColumn: "span 4" }}
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                p: "1rem",
                m: "2rem 0",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
