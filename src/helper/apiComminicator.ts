import axios from "axios";

const BASEURL = "https://chatbotbackend-two.vercel.app/api/v1";

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${BASEURL}/user/login`, { email, password });
  if (response.status !== 200)
    throw new Error("Unable to Login");
  const data = await response.data;
  return data;
}

export const checkAuthStatus = async () => {
  const response = await axios.get(`${BASEURL}/user/authenticate`);
  if (response.status !== 200)
    throw new Error("Authentication Failed");
  const data = await response.data;
  return data;
}

export const logoutUser = async () => {
  const res = await axios.get(`${BASEURL}/user/logout`);
  if (res.status !== 200) {
    throw new Error("Unable to logout");
  }
  const data = await res.data;
  return data;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await axios.post(`${BASEURL}/user/signup`, { name, email, password });
  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }
  const data = await res.data;
  return data;
};

export const sendChatRequest = async (message: string, language:string) => {
  const req = { "question": message, "language": language };
  const res = await axios.post(`${BASEURL}/ai/sendQuery`, req);
  if (res.status !== 200) {
    throw new Error("unable to chat");
  }
  const data = await res.data.outputText;
  return data;
};

export const deleteChats = async () => {
  const res = await axios.get(`${BASEURL}/chats/delete`);
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
};

export const getChats = async () => {
  const res = await axios.get(`${BASEURL}/chats/get-chat`);
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  const data = await res.data;
  return data;
};