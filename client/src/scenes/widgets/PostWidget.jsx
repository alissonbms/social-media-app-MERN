import { useState } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Close,
  FeedbackOutlined,
  FormatListBulleted,
  DeleteOutlined,
  EditOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputBase,
  Button,
  Modal,
  TextareaAutosize,
  Popover,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import {
  setPost,
  setPostComments,
  setPostDeletedComments,
  setPostEditedComments,
  setPosts,
} from "state";
import CustomImage from "components/CustomImage";
import {
  useLikeOrDislikePostMutation,
  useLikeOrDislikeCommentMutation,
  useCreateCommentMutation,
  useEditThePostMutation,
  useDeleteThePostMutation,
  useEditTheCommentMutation,
  useDeleteTheCommentMutation,
} from "features/apiSlice";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  pictureUrl,
  userPictureUrl,
  likes,
  comments,
}) => {
  const [likeOrDislikePost] = useLikeOrDislikePostMutation();
  const [likeOrDislikeComment] = useLikeOrDislikeCommentMutation();
  const [editThePost] = useEditThePostMutation();
  const [deleteThePost] = useDeleteThePostMutation();
  const [editTheComment] = useEditTheCommentMutation();
  const [deleteTheComment] = useDeleteTheCommentMutation();

  const [createComment] = useCreateCommentMutation();

  const dispatch = useDispatch();
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewCommet] = useState("");
  const [open, setOpen] = useState(false);
  const [editPost, setEditPost] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [editComment, setEditComment] = useState("");
  const [idCommentEditing, setIdCommentEditing] = useState("");

  const loggedInUserId = useSelector((state) => state.authReducer.user._id);
  const isLiked = likes.includes(loggedInUserId);
  const likeCount = likes.length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const dark = palette.neutral.dark;
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const medium = palette.neutral.medium;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditPost("");
  };

  const handleClickPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const idPopover = openPopover ? "simple-popover" : undefined;

  const patchLikePost = async () => {
    const data = { userId: loggedInUserId, postId };
    const updatedPost = await likeOrDislikePost(data).unwrap();
    dispatch(setPost({ post: updatedPost }));
  };

  const patchLikeComment = async (commentId) => {
    const data = { commentId, userId: loggedInUserId };
    const savedComment = await likeOrDislikeComment(data).unwrap();
    dispatch(setPostComments({ postId, commentId, comment: savedComment }));
  };

  const handleFormComment = async () => {
    const data = { postId, userId: loggedInUserId, comment: newComment };
    const postsNewComment = await createComment(data).unwrap();
    dispatch(setPost({ post: postsNewComment }));
    setNewCommet("");
  };

  const handleDelete = async () => {
    const data = { userId: loggedInUserId, postId };
    const updatedPosts = await deleteThePost(data).unwrap();
    dispatch(setPosts({ posts: updatedPosts }));
  };

  const handleEdit = async () => {
    const data = { userId: loggedInUserId, postId, description: editPost };
    const response = await editThePost(data).unwrap();
    dispatch(setPost({ post: response.updatedPost }));
    dispatch(setPosts({ posts: response.posts }));
    handleClose();
  };

  const handleDeleteComment = async (commentId) => {
    const data = { commentId, userId: loggedInUserId, postId };
    await deleteTheComment(data);
    dispatch(setPostDeletedComments({ postId, comment: commentId }));
  };

  const handleEditComment = async () => {
    const data = {
      userId: loggedInUserId,
      commentId: idCommentEditing,
      comment: editComment,
    };
    const commentUpdated = await editTheComment(data).unwrap();
    dispatch(
      setPostEditedComments({
        postId,
        commentId: idCommentEditing,
        comment: commentUpdated.comment,
      })
    );
    setIdCommentEditing("");
    setEditComment("");
    setIsEditingComment(false);
  };

  return (
    <>
      <WidgetWrapper mb="2rem">
        <FlexBetween>
          <Friend
            friendId={postUserId}
            name={name}
            subtitle={location}
            pictureUrl={userPictureUrl}
          />
          {postUserId === loggedInUserId ? (
            <IconButton
              aria-describedby={idPopover}
              variant="contained"
              onClick={handleClickPopover}
              sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
              <FormatListBulleted sx={{ color: primaryDark }} />
            </IconButton>
          ) : (
            <IconButton disabled={true}>
              <FormatListBulleted />
            </IconButton>
          )}
        </FlexBetween>
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
        {pictureUrl && (
          <img
            src={pictureUrl}
            width="100%"
            height="auto"
            alt="post"
            style={{
              borderRadius: "0.75rem",
              marginTop: "0.75rem",
            }}
          />
        )}
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1.3rem">
            <FlexBetween gap="0.2rem">
              <IconButton onClick={patchLikePost}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>

            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length ? comments.length : 0}</Typography>
            </FlexBetween>

            <IconButton>
              <ShareOutlined />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        {isComments && (
          <>
            <Divider sx={{ m: "1rem 0" }} />
            <Box mt="0.5rem">
              {comments.map((comment) => (
                <Box key={comment._id}>
                  <FlexBetween>
                    <FlexBetween gap="0.5rem">
                      <CustomImage
                        imageUrl={comment.userPictureUrl}
                        alt="aa"
                        size="50px"
                      />
                      <Box>
                        <Typography
                          fontSize="12px"
                          fontWeight="500"
                          color={main}
                        >
                          {`${comment.firstName} ${comment.lastName}`}
                        </Typography>
                        {isEditingComment &&
                        idCommentEditing === comment._id ? (
                          <Box>
                            <InputBase
                              onChange={(e) => setEditComment(e.target.value)}
                              value={editComment}
                              placeholder={comment.comment}
                              sx={{
                                width: "100%",
                                m: "0.3rem 0",
                              }}
                            />
                            <Button
                              onClick={handleEditComment}
                              disabled={!editComment}
                              sx={{
                                width: "100%",
                                color: palette.background.alt,
                                backgroundColor: palette.primary.main,
                                borderRadius: "2rem",
                                padding: "0.4rem 1rem",
                                "&:hover": { color: palette.primary.main },
                              }}
                            >
                              EDIT
                            </Button>
                          </Box>
                        ) : (
                          <Typography fontSize="15px" sx={{ m: "0.25rem 0" }}>
                            {comment.comment}
                          </Typography>
                        )}
                      </Box>
                    </FlexBetween>
                    <FlexBetween gap="0.2rem">
                      {(comment.userId === loggedInUserId ||
                        postUserId === loggedInUserId) && (
                        <FlexBetween gap="0.1rem">
                          {comment.userId === loggedInUserId ? (
                            <IconButton
                              onClick={() => {
                                setIdCommentEditing(comment._id);
                                setIsEditingComment(!isEditingComment);
                              }}
                            >
                              <EditOutlined sx={{ color: main }} />
                            </IconButton>
                          ) : (
                            <IconButton>
                              <FeedbackOutlined sx={{ color: main }} />
                            </IconButton>
                          )}
                          <IconButton
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <DeleteOutlined sx={{ color: main }} />
                          </IconButton>
                        </FlexBetween>
                      )}
                      <IconButton onClick={() => patchLikeComment(comment._id)}>
                        {comment.likes.includes(loggedInUserId) === true ? (
                          <FavoriteOutlined sx={{ color: primary }} />
                        ) : (
                          <FavoriteBorderOutlined />
                        )}
                      </IconButton>
                      <Typography>{comment.likes.length}</Typography>
                    </FlexBetween>
                  </FlexBetween>
                  <Divider sx={{ m: "1rem 0" }} />
                </Box>
              ))}
              {/*  */}
            </Box>
            <FlexBetween gap="1rem">
              <InputBase
                onChange={(e) => setNewCommet(e.target.value)}
                value={newComment}
                placeholder="What do you think?"
                sx={{
                  width: "100%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "2rem",
                  padding: "0.4rem 1.8rem",
                }}
              />
              <Button
                onClick={handleFormComment}
                disabled={!newComment}
                sx={{
                  color: palette.background.alt,
                  backgroundColor: palette.primary.main,
                  borderRadius: "2rem",
                  padding: "0.4rem 1rem",
                  "&:hover": { color: palette.primary.main },
                }}
              >
                COMMENT
              </Button>
            </FlexBetween>
          </>
        )}

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
      </WidgetWrapper>
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
              Edit your post:
            </Typography>
            <IconButton
              onClick={() => setOpen(false)}
              sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
              <Close sx={{ color: primaryDark }} />
            </IconButton>
          </FlexBetween>

          <TextareaAutosize
            onChange={(e) => setEditPost(e.target.value)}
            value={editPost}
            placeholder={description}
            minRows={5}
            style={{
              width: "100%",
              fontSize: "1rem",
              padding: "1rem",
              borderRadius: "0.4rem",
              backgroundColor: palette.neutral.light,
              color: dark,
              outline: "none",
            }}
          />
          <Button
            disabled={!editPost}
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

export default PostWidget;
