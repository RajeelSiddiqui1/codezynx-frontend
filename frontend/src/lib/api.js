import { Await } from "react-router";
import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await axiosInstance.put("/auth/update-profile", profileData);
  return response.data;
};


export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

//post

export async function getAllPosts() {
  const response = await axiosInstance.get('/post/get-post')
  return response.data;
}

export async function createPost(postData) {
  const response = await axiosInstance.post('/post/create-post', postData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data
}
export async function updatePost(postId, formData) {
  const response = await axiosInstance.put(`/post/update-post/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function deletePost(postId) {
  const response = await axiosInstance.delete(`/post/delete-post/${postId}`);
  return response.data;
}




export async function togglePostLike(postId) {
  return await axiosInstance.post(`/post/${postId}/like`).then(res => res.data);
}


export async function toggleCommentLike(postId, commentId) {
  return await axiosInstance.post(`/post/${postId}/comment/${commentId}/like`);
}

export async function addComment(postId, text) {
  return await axiosInstance.post(`/post/${postId}/comment`, { text });
}

export async function addReply(postId, commentId, text) {
  return axiosInstance.post(`/post/${postId}/comment/${commentId}/reply`, { text });
}

export async function aiPrompt(prompt) {
  const  response = await axiosInstance.post('/ai/get-response/',{prompt});
  return response.data;
}