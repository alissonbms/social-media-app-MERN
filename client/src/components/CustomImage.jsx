import { Box } from "@mui/material";

const CustomImage = ({ imageUrl, size, imageAlt, radius }) => {
  return (
    <Box
      component="img"
      sx={{
        width: size || "60px",
        height: size || "60px",
        borderRadius: radius || "50%",
        objectFit: "cover",
      }}
      alt={imageAlt}
      src={imageUrl}
    />
  );
};

export default CustomImage;
