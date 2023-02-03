import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      <Box
        width="100%"
        padding="1rem 6%"
        backgroundColor={theme.palette.background.alt}
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Media
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        backgroundColor={theme.palette.background.alt}
        p="2rem"
        borderRadius="1.5rem"
        m="2rem auto"
      >
        <Typography variant="h5" fontWeight="500" sx={{ mb: "1.5rem" }}>
          Welcome to Media, the best Social Media for talk!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
