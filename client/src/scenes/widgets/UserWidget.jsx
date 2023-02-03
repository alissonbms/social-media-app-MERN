import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  Close,
  DeleteOutlined,
  PersonAddOutlined,
  PersonRemoveOutlined,
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import CustomImage from "components/CustomImage";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Button,
  IconButton,
  TextField,
  Popover,
  Modal,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDeleteTheUserMutation,
  useEditTheUserMutation,
  useGetUserByIdQuery,
  useChangeFriendshipStatusMutation,
  useGetUserFriendsQuery,
} from "features/apiSlice";
import { ClipLoader } from "react-spinners";
import { setLogout, setChangeUser } from "state";

const UserWidget = ({ userId }) => {
  const [changeFriendshipStatus] = useChangeFriendshipStatusMutation();

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteTheUser] = useDeleteTheUserMutation();
  const [editTheUser] = useEditTheUserMutation();
  const [editFirstName, setEditFirstName] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const navigate = useNavigate();
  const loggedId = useSelector((state) => state.authReducer.user._id);
  const { data: userLoggedFriends } = useGetUserFriendsQuery(loggedId);

  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const primaryDark = palette.primary.dark;
  const primaryLight = palette.primary.light;

  const { data, isLoading, refetch } = useGetUserByIdQuery(userId);

  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    refetch();
    setIsFriend(userLoggedFriends?.find((friend) => friend._id === userId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, userLoggedFriends]);

  if (isLoading) {
    return (
      <Box width="100%">
        <ClipLoader color="primary" />
      </Box>
    );
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
    pictureUrl,
  } = data;

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setEditFirstName("");
    setEditPassword("");
    setOpen(false);
  };

  const handleClickPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const idPopover = openPopover ? "simple-popover" : undefined;

  const handleDelete = async () => {
    const data = { userId, loggedId };
    await deleteTheUser(data);
    dispatch(setLogout());
  };

  const handleEdit = async () => {
    const data = {
      userId,
      loggedId,
      firstName: editFirstName,
      password: editPassword,
    };
    const editedUser = await editTheUser(data).unwrap();
    dispatch(setChangeUser({ user: editedUser }));
    dispatch(setLogout());
  };

  const handlePatch = async () => {
    const data = { userId: loggedId, friendId: userId };
    await changeFriendshipStatus(data);
    setIsFriend(!isFriend);
    //navigate(0);
  };

  return (
    <>
      <WidgetWrapper>
        <FlexBetween pb="1.1rem" gap="0.5rem">
          <FlexBetween gap="1rem">
            <CustomImage imageUrl={pictureUrl} />
            <Box>
              <Typography
                variant="h4"
                color={dark}
                fontWeight="500"
                onClick={() => {
                  navigate(
                    userId === loggedId ? "/home" : `/profile/${userId}`
                  );
                  //navigate(0);
                }}
                sx={{
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}
              >
                {firstName} {lastName}
              </Typography>
              <Typography color={medium}>{friends.length} friends</Typography>
            </Box>
          </FlexBetween>
          {loggedId === userId ? (
            <ManageAccountsOutlined
              onClick={handleClickPopover}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            />
          ) : (
            <IconButton
              onClick={handlePatch}
              sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
              {isFriend ? (
                <PersonRemoveOutlined sx={{ color: primaryDark }} />
              ) : (
                <PersonAddOutlined sx={{ color: primaryDark }} />
              )}
            </IconButton>
          )}
        </FlexBetween>

        <Divider />

        <Box p="1rem 0">
          <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
            <LocationOnOutlined fontSize="large" sx={{ color: main }} />
            <Typography color={medium}>{location}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap="1rem">
            <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
            <Typography color={medium}>{occupation}</Typography>
          </Box>
        </Box>

        <Divider />

        <Box p="1rem 0">
          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Who's viewed your profile</Typography>
            <Typography color={main} fontWeight="500">
              {viewedProfile}
            </Typography>
          </FlexBetween>
          <FlexBetween>
            <Typography color={medium}>Impressions of your post</Typography>
            <Typography color={main} fontWeight="500">
              {impressions}
            </Typography>
          </FlexBetween>
        </Box>

        <Divider />

        <Box p="1rem 0">
          <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
            Social Profiles
          </Typography>

          <FlexBetween gap="1rem" mb="0.5rem">
            <FlexBetween gap="1rem">
              <img src="../assets/twitter.png" alt="twitter" />
              <Box>
                <Typography color={main} fontWeight="500">
                  Twitter
                </Typography>
                <Typography color={medium}>Social Network</Typography>
              </Box>
            </FlexBetween>
            <EditOutlined sx={{ color: main }} />
          </FlexBetween>

          <FlexBetween gap="1rem">
            <FlexBetween gap="1rem">
              <img src="../assets/linkedin.png" alt="linkedin" />
              <Box>
                <Typography color={main} fontWeight="500">
                  Linkedin
                </Typography>
                <Typography color={medium}>Network Network</Typography>
              </Box>
            </FlexBetween>
            <EditOutlined sx={{ color: main }} />
          </FlexBetween>
        </Box>
      </WidgetWrapper>
      <Popover
        id={idPopover}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box padding="0.8rem">
          <FlexBetween width="100%" gap="1rem">
            <Typography>Edit</Typography>
            <IconButton onClick={handleOpen} sx={{ p: "0.6rem" }}>
              <EditOutlined sx={{ color: primaryDark }} />
            </IconButton>
          </FlexBetween>
          <Divider sx={{ m: "1rem 0" }} />
          <FlexBetween gap="1rem">
            <Typography>Delete</Typography>
            <IconButton onClick={handleDelete} sx={{ p: "0.6rem" }}>
              <DeleteOutlined sx={{ color: primaryDark }} />
            </IconButton>
          </FlexBetween>
        </Box>
      </Popover>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: palette.background.alt,
            border: `1px solid ${medium}`,
            boxShadow: 24,
            p: "2rem",
            borderRadius: "0.4rem",
          }}
        >
          <FlexBetween gap="1rem" mb="1rem">
            <Typography variant="h4" color={dark} fontWeight="500">
              Edit your account details:
            </Typography>
            <IconButton
              onClick={() => setOpen(false)}
              sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
              <Close sx={{ color: primaryDark }} />
            </IconButton>
          </FlexBetween>

          <TextField
            placeholder={firstName}
            label="Your first name"
            onChange={(e) => setEditFirstName(e.target.value)}
            value={editFirstName}
            name="firstName"
            sx={{ width: "100%", mb: "1.5rem" }}
          />
          <TextField
            placeholder=". . . . . ."
            type="password"
            label="Your password"
            onChange={(e) => setEditPassword(e.target.value)}
            value={editPassword}
            name="password"
            sx={{ width: "100%" }}
          />

          <Button
            disabled={!editFirstName && !editPassword}
            fullWidth
            onClick={handleEdit}
            sx={{
              p: "1rem",
              mt: "1rem",
              backgroundColor: palette.primary.main,
              color: palette.background.alt,
              "&:hover": { color: palette.primary.main },
            }}
          >
            EDIT
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default UserWidget;
