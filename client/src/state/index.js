import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  token: null,
  user: null,
  posts: [],
  comments: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.token = null;
      state.user = null;
    },
    setChangeUser: (state, action) => {
      state.user = action.payload.user;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) {
          return action.payload.post;
        }

        return post;
      });

      state.posts = updatedPosts;
    },
    setPostComments: (state, action) => {
      const updatedCommentsPosts = state.posts.map((post) => {
        if (post._id === action.payload.postId) {
          post.comments.map((comment) => {
            if (comment._id === action.payload.commentId) {
              return (comment.likes = action.payload.comment.likes);
            }
            return comment;
          });
        }

        return post;
      });

      state.posts = updatedCommentsPosts;
    },

    setPostEditedComments: (state, action) => {
      const updatedCommentsPosts = state.posts.map((post) => {
        if (post._id === action.payload.postId) {
          post.comments.map((comment) => {
            if (comment._id === action.payload.commentId) {
              return (comment.comment = action.payload.comment);
            }
            return comment;
          });
        }

        return post;
      });

      state.posts = updatedCommentsPosts;
    },
    setPostDeletedComments: (state, action) => {
      const updatedCommentsPosts = state.posts.map((post) => {
        if (post._id === action.payload.postId) {
          post.comments.map((comment, i) => {
            if (comment._id === action.payload.comment) {
              post.comments.splice(post.comments.indexOf(i), 1);
            }
            return comment;
          });
        }

        return post;
      });
      state.posts = updatedCommentsPosts;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setChangeUser,
  setFriends,
  setPosts,
  setPost,
  setPostComments,
  setPostEditedComments,
  setPostDeletedComments,
} = authSlice.actions;

export default authSlice.reducer;
