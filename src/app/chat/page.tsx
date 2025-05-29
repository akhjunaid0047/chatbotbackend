'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import { useAuth } from '@/context/AuthContext';
import ChatItem from '@/components/chat/ChatItem';
import { IoMdSend } from "react-icons/io";
import { sendChatRequest, getChats, deleteChats } from "@/helper/apiComminicator"
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { red } from '@mui/material/colors';

type Message = {
  role: string;
  content: string;
}

const Chat = () => {
  const [language, setLanguage] = useState('ENGLISH');
  const handleLanguageChange = (e: { target: { checked: boolean; }; }) => {
    const newLanguage = e.target.checked ? 'HINDI' : 'ENGLISH';
    setLanguage(newLanguage);
  };

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    const chatData = await sendChatRequest(content, language);
    const newReceivedMessage: Message = { role: "assistant", content: chatData };
    setChatMessages((prev) => [...prev, newReceivedMessage]);
  }

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch {
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getChats().then((data) => {
        setChatMessages([...data.chats]);
        toast.success("Successfully loaded chats", { id: "loadchats" });
      }).catch((err) => {
        toast.error("Loading Failed", { id: "loadchats" });
        console.error(err);
      });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
        router.push("/login");
    }
  }, [auth?.user, router]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <Box sx={{ display: "flex", flex: 1, width: "100%", height: "100%", mt: 3, gap: 3 }}>
      <Box sx={{ display: { md: "flex", xs: "none", sm: "none", flex: 0.2, flexDirection: "column" } }}>
        <Box sx={{ display: "flex", width: "100%", height: "60vh", bgcolor: "rgb(17,29,39)", borderRadius: 5, flexDirection: "column", mx: 3, }}>
          <Avatar sx={{ mx: "auto", my: "2", bgcolor: "white", color: "black", fontWeight: 700, mt: 4, mb: 4 }}>
            {/* {auth?.user?.name[0]} */}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to a ChatBot
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
            You can ask any type of questions to me but Avoid sharing personal information.
          </Typography>

          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: 700,
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": { bgcolor: red.A400 }
            }}
          >
            Clear Chat
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flex: { md: 0.8, xs: 1, sm: 1 }, flexDirection: "column", px: 3 }}>
        <Typography sx={{ textAlign: "center", fontSize: "40px", color: "white", mb: 2, mx: "auto", fontWeight: 600 }}>
          AssemblyBot 4-o
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 5, justifyContent: "center", alignItems: "center" }}>
          {/* Language Toggle Switch */}
          <div className="switch" style={{ gap: 5 }}>
            <input
              id="language-toggle"
              className="check-toggle check-toggle-round-flat"
              type="checkbox"
              checked={language === 'HINDI'}
              onChange={handleLanguageChange}
            />
            <label htmlFor="language-toggle"></label>
            <span className="off">Chat in Hindi</span>
          </div>
        </Box>

        <Box
          ref={chatContainerRef}
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chat, index) => (
            // @ts-expect-error
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
        </Box>

        <div style={{ width: "100%", padding: "20px", borderRadius: 8, backgroundColor: "rgb(17,27,39)", display: "flex", margin: "auto" }}>
          <input
            ref={inputRef}
            type="text"
            style={{ width: "100%", backgroundColor: "transparent", padding: "10px", border: "none", outline: "none", color: "white", fontSize: "20px" }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
          <IconButton onClick={handleSubmit} sx={{ ml: "auto", color: "white" }}><IoMdSend /></IconButton>
        </div>
      </Box>
    </Box>
  );
}

export default Chat;
