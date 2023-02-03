import { Box, useMediaQuery } from "@mui/material";

import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import FeedPostsWidget from "scenes/widgets/FeedPostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { _id, pictureUrl } = useSelector((state) => state.authReducer.user);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        display={isNonMobileScreens ? "flex" : "block"}
        justifyContent="space-between"
        gap="0.5rem"
        padding="2rem 6%"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget pictureUrl={pictureUrl} />
          <FeedPostsWidget />
        </Box>
        {isNonMobileScreens && (
          <Box
            flexBasis={isNonMobileScreens ? "26%" : undefined}
            display="flex"
            flexDirection="column"
            gap="2rem"
          >
            <AdvertWidget />
            <FriendListWidget id={_id} isProfile={false} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
