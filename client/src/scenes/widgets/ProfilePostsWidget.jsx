import { Box } from "@mui/material";
import { useGetUserPostsQuery } from "features/apiSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const ProfilePostsWidget = () => {
  const location = useLocation();
  const userId = location.pathname.split("/").pop();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.authReducer.posts);
  const { data, isLoading, refetch } = useGetUserPostsQuery(userId);

  useEffect(() => {
    refetch();
    if (data) {
      dispatch(setPosts({ posts: data }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      {!isLoading && data ? (
        posts?.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            location,
            pictureUrl,
            userPictureUrl,
            likes,
            comments,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              pictureUrl={pictureUrl}
              userPictureUrl={userPictureUrl}
              likes={likes}
              comments={comments}
            />
          )
        )
      ) : (
        <Box width="100%">
          <ClipLoader color="primary" />
        </Box>
      )}
    </>
  );
};

export default ProfilePostsWidget;
