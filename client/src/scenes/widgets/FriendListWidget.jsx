import { Box, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useGetUserFriendsQuery } from "features/apiSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { setFriends } from "state";
import { Message } from "@mui/icons-material";

const FriendListWidget = ({ id }) => {
  const dispatch = useDispatch();
  const { data, isLoading, refetch } = useGetUserFriendsQuery(id);
  const friends = useSelector((state) => state.authReducer.user.friends);
  const { palette } = useTheme();

  useEffect(() => {
    refetch();
    if (data) {
      dispatch(setFriends({ friends: data }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {!isLoading && data ? (
          friends?.map((friend, index) => (
            <FlexBetween key={friend._id}>
              <Friend
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                pictureUrl={friend.pictureUrl}
              />
              <IconButton>
                <Message />
              </IconButton>
            </FlexBetween>
          ))
        ) : (
          <Box width="100%">
            <ClipLoader color="primary" />
          </Box>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
