import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import CustomImage from "components/CustomImage";
import WidgetWrapper from "components/WidgetWrapper";

import { setPosts } from "state";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useCreatePostMutation } from "features/apiSlice";
import { useNavigate } from "react-router-dom";

const MyPostWidget = ({ pictureUrl }) => {
  const navigate = useNavigate();
  const [createPost] = useCreatePostMutation();
  const dispatch = useDispatch();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { palette } = useTheme();
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const { _id } = useSelector((state) => state.authReducer.user);
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [picturePreview, setPicturePreview] = useState("");

  const handleForm = async () => {
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);

    if (image) {
      formData.append("pictureFile", image);
      formData.append("pictureType", "post");
    }

    const postsNew = await createPost(formData).unwrap();
    if (postsNew) {
      dispatch(setPosts({ posts: postsNew }));
    }
    setPost("");
    setImage(null);
    navigate(0);
  };

  return (
    <WidgetWrapper mb="2rem">
      <FlexBetween>
        <InputBase
          onChange={(e) => setPost(e.target.value)}
          value={post}
          placeholder="What's on your mind..."
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "0.8rem 1.8rem",
          }}
        />
      </FlexBetween>

      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => {
              setImage(acceptedFiles[0]);
              setPicturePreview(acceptedFiles[0]);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="85%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add your picture post here</p>
                  ) : (
                    <FlexBetween>
                      <Box display="flex" gap="10px" alignItems="center">
                        <CustomImage
                          size="100px"
                          radius="none"
                          alt="post picture"
                          imageUrl={URL.createObjectURL(picturePreview)}
                        />
                        <Typography>{image.name}</Typography>
                      </Box>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                <IconButton onClick={() => setImage(null)} disabled={!image}>
                  <DeleteOutlined />
                </IconButton>
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween
          gap="0.25rem"
          color={mediumMain}
          sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          onClick={() => setIsImage(!isImage)}
        >
          <ImageOutlined />
          <Typography>Image</Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>
            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>
            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <>
            <FlexBetween gap="0.25rem">
              <MoreHorizOutlined sx={{ color: mediumMain }} />
            </FlexBetween>
          </>
        )}

        <Button
          onClick={handleForm}
          disabled={!post}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            "&:hover": { color: palette.primary.main },
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
