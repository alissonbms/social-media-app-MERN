import { Box, useMediaQuery } from "@mui/material";

import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import ProfilePostsWidget from "scenes/widgets/ProfilePostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { useLocation } from "react-router-dom";

const ProfilePage = () => {
  const location = useLocation();
  const userId = location.pathname.split("/").pop();
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
          <UserWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <ProfilePostsWidget userId={userId} />
        </Box>
        {isNonMobileScreens && (
          <Box
            flexBasis={isNonMobileScreens ? "26%" : undefined}
            display="flex"
            flexDirection="column"
            gap="2rem"
          >
            <AdvertWidget />
            <FriendListWidget id={userId} isProfile={true} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;
