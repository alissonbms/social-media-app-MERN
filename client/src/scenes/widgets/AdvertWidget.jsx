import { useTheme, Typography, Box } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import FlexBetween from "components/FlexBetween";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const AdvertWidget = () => {
  const [advertInfo, setAdvertInfo] = useState(null);
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const ads = [
    {
      photo:
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      name: "Best Barber Shop",
      website: "wellgroomedbeardhere.com",
      message:
        "Come, feel at home, have a good conversation and incredible service, we take care of your beard as we take care of ours.",
    },
    {
      photo:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      name: "Gourmet Restaurant",
      website: "gourmetFood.com",
      message:
        "Do you want to taste quality food? This is the right place, we have a menu with several options and all with full approval!",
    },
    {
      photo:
        "https://images.unsplash.com/photo-1674230226985-f7d78563c90d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      name: "Book Properties",
      website: "bookinGood.com",
      message:
        "You deserve a wonderful stay, do not waste time, plan, book and get ready to experience new cultures and have a lot of fun",
    },
    {
      photo:
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      name: "Travel now!",
      website: "travel.now.com",
      message:
        "Pack your bags, settle into your seat and set up your travel plan with us, we guarantee you won't regret it and you'll see beautiful views",
    },
    {
      photo:
        "https://raw.githubusercontent.com/ed-roh/mern-social-media/master/server/public/assets/info4.jpeg",
      name: "MikaCosmetics",
      website: "mikacosmetics.com",
      message:
        "Your pathway to stunning and immaculate beauty and made sure your skin  is exfoliating skin and shining like light",
    },
  ];

  useEffect(() => {
    let aleatory = Math.floor(Math.random() * ads.length);
    setAdvertInfo(ads[aleatory]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!advertInfo) {
    return (
      <Box width="100%">
        <ClipLoader color="primary" />
      </Box>
    );
  }

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt={`advert by ${advertInfo.website}`}
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
        src={advertInfo.photo}
      />
      <FlexBetween>
        <Typography color={main}>{advertInfo.name}</Typography>
        <Typography color={medium}>{advertInfo.website}</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        {advertInfo.message}
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
