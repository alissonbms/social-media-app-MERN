import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const serverApi = createApi({
  reducerPath: "serverApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://abms-socialmedia-app-api.onrender.com/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().authReducer.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // USER
    registerUser: builder.mutation({
      query: (formData) => ({
        url: "auth/register",
        method: "POST",
        body: formData,
      }),
    }),
    loginUser: builder.mutation({
      query: (values) => ({
        url: "auth/login",
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getUserById: builder.query({
      query: (userId) => `user/${userId}`,
    }),
    getUserFriends: builder.query({
      query: (id) => `user/${id}/friends`,
    }),
    changeFriendshipStatus: builder.mutation({
      query: ({ userId, friendId }) => ({
        url: `user/changeFriend/${userId}/${friendId}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    editTheUser: builder.mutation({
      query: ({ userId, loggedId, firstName, password }) => ({
        url: `user/edit/${userId}/${loggedId}`,
        method: "PATCH",
        body: password !== "" ? { firstName, password } : { firstName },
      }),
    }),
    deleteTheUser: builder.mutation({
      query: ({ userId, loggedId }) => ({
        url: `user/${userId}/${loggedId}`,
        method: "DELETE",
      }),
    }),
    // POST
    createPost: builder.mutation({
      query: (formData) => ({
        url: "post",
        method: "POST",
        body: formData,
      }),
    }),
    getFeedPosts: builder.query({
      query: () => `post`,
    }),
    getUserPosts: builder.query({
      query: (userId) => `post/${userId}/posts`,
    }),
    likeOrDislikePost: builder.mutation({
      query: ({ userId, postId }) => ({
        url: `post/${postId}/like`,
        method: "PATCH",
        body: { userId },
      }),
    }),
    editThePost: builder.mutation({
      query: ({ userId, postId, description }) => ({
        url: `post/${postId}/${userId}/edit`,
        method: "PATCH",
        body: { description },
      }),
    }),
    deleteThePost: builder.mutation({
      query: ({ userId, postId }) => ({
        url: `post/${postId}`,
        method: "DELETE",
        body: { userId },
      }),
    }),
    // COMMENT
    getPostComments: builder.query({
      query: (postId) => `comment/${postId}`,
    }),
    createComment: builder.mutation({
      query: ({ postId, userId, comment }) => ({
        url: `comment/${postId}/create`,
        method: "POST",
        body: { userId, comment },
      }),
    }),
    likeOrDislikeComment: builder.mutation({
      query: ({ commentId, userId }) => ({
        url: `comment/${commentId}/like`,
        method: "PATCH",
        body: { userId },
      }),
    }),
    editTheComment: builder.mutation({
      query: ({ userId, commentId, comment }) => ({
        url: `comment/edit/${commentId}/${userId}`,
        method: "PATCH",
        body: { comment },
      }),
    }),
    deleteTheComment: builder.mutation({
      query: ({ commentId, userId, postId }) => ({
        url: `comment/${commentId}/${userId}/${postId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserByIdQuery,
  useGetUserFriendsQuery,
  useChangeFriendshipStatusMutation,
  useEditTheUserMutation,
  useDeleteTheUserMutation,
  useCreatePostMutation,
  useGetFeedPostsQuery,
  useGetUserPostsQuery,
  useLikeOrDislikePostMutation,
  useEditThePostMutation,
  useDeleteThePostMutation,
  useGetPostCommentsQuery,
  useCreateCommentMutation,
  useLikeOrDislikeCommentMutation,
  useEditTheCommentMutation,
  useDeleteTheCommentMutation,
} = serverApi;
