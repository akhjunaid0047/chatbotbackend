"use server";

const BASE_URL = "http://localhost:3000/api/v1";

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },    
    body: JSON.stringify({ email, password }),
    credentials: "include", // if you rely on cookies
  });
  if (response.status !== 200) {
    throw new Error("Unable to Login"); 
  }
  return await response.json();
};

export const checkAuthStatus = async () => {
  const response = await fetch(`${BASE_URL}/user/authenticate`, {
    method: "GET",
    credentials: "include",
  });
  if (response.status !== 200) {
    throw new Error("Authentication Failed");
  }
  return await response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`${BASE_URL}/user/logout`, {
    method: "GET",
    credentials: "include",
  });
  if (response.status !== 200) {
    throw new Error("Unable to logout");
  }
  return await response.json();
};

export const signupUser = async (name: string, email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/user/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
    credentials: "include",
  });
  if (response.status !== 201) {
    throw new Error("Unable to Signup");
  }
  return await response.json();
};

export const sendChatRequest = async (message: string, language: string) => {
  const response = await fetch(`${BASE_URL}/ai/sendQuery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question: message, language }),
    credentials: "include",
  });
  console.log(response);
  if (response.status !== 200) {
    throw new Error("Unable to chat");
  }
  return await response.json();
};

export const deleteChats = async () => {
  const response = await fetch(`${BASE_URL}/chats/delete`, {
    method: "GET",
    credentials: "include",
  });
  if (response.status !== 200) {
    throw new Error("Unable to delete chats");
  }
};

export const getChats = async () => {
  const response = await fetch(`${BASE_URL}/chats/get-chat`, {
    method: "GET",
    credentials: "include",
  });
  // if (response.status !== 200) {
  //   throw new Error("Unable to send chat");
  // }
  return await response.json();
};
