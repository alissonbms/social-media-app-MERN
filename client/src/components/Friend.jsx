import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import CustomImage from "./CustomImage";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Friend = ({ friendId, pictureUrl, name, subtitle }) => {
  const loggedId = useSelector((state) => state.authReducer.user._id);

  const navigate = useNavigate();
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <>
      <FlexBetween>
        <FlexBetween gap="1rem">
          <CustomImage
            imageUrl={pictureUrl}
            alt="profile picture"
            size="55px"
          />
          <Box>
            <Typography
              onClick={() =>
                navigate(
                  friendId === loggedId ? "/home" : `/profile/${friendId}`
                )
              }
              color={main}
              variant="h5"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {name}
            </Typography>
            <Typography color={medium} fontSize="0.80rem">
              {subtitle}
            </Typography>
          </Box>
        </FlexBetween>
      </FlexBetween>
    </>
  );
};

export default Friend;
