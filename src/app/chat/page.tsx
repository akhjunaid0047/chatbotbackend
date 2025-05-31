/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import React, {
  useEffect,
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  sendChatRequest,
  getChats,
  deleteChats,
} from "@/helper/apiComminicator";
import { cn } from "@/lib/utils";
import { SendIcon, LoaderIcon } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// --- Auto-resizing textarea hook ---
function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: {
  minHeight: number;
  maxHeight?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }
      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) textarea.style.height = `${minHeight}px`;
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

// --- Textarea component ---
const Textarea = React.forwardRef<HTMLTextAreaElement, any>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          "transition-all duration-200 ease-in-out",
          "placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// --- Typing Dots animation ---
function TypingDots() {
  return (
    <div className="flex items-center ml-1">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="w-1.5 h-1.5 bg-white/90 rounded-full mx-0.5"
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.9, 0.3],
            scale: [0.85, 1.1, 0.85],
          }}
          transition={{
            duration: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            delay: dot * 0.15,
            ease: "easeInOut",
          }}
          style={{
            boxShadow: "0 0 4px rgba(255, 255, 255, 0.3)",
          }}
        />
      ))}
    </div>
  );
}

// --- Main Chat Component ---
export default function AnimatedAIChat() {
  // States
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; content: string }[]
  >([]);
  const [value, setValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<"ENGLISH" | "HINDI">("ENGLISH");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  // Auth & Router
  const { status } = useSession();
  const router = useRouter();

  // --- Fetch chat history on mount
  useLayoutEffect(() => {
    if (status === "authenticated" || status === "loading") {
      toast.loading("Loading Chats", { id: "loadchats" });
      getChats()
        .then((data) => {
          setMessages(
            data.chats.map((msg: { role: string; content: string }) => ({
              sender: msg.role === "user" ? "user" : "bot",
              content: msg.content,
            }))
          );
          toast.success("Successfully loaded chats", { id: "loadchats" });
        })
        .catch(() => {
          toast.error("Loading Failed", { id: "loadchats" });
        });
    }
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Send Chat Handler
  const handleSendMessage = async () => {
    if (!value.trim()) return;
    const userMsg = value.trim();
    setMessages((prev) => [...prev, { sender: "user", content: userMsg }]);
    setValue("");
    adjustHeight(true);

    setIsTyping(true);

    try {
      const reply = await sendChatRequest(userMsg, language);
      setMessages((prev) => [...prev, { sender: "bot", content: reply }]);
    } catch (err) {
      toast.error("Failed to send message");
      console.log("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          content: "Sorry, something went wrong. Please try again!",
        },
      ]);
    }
    setIsTyping(false);
  };

  // --- Delete Chats Handler
  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteChats();
      setMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch {
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };

  // --- Language Toggle Handler
  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === "ENGLISH" ? "HINDI" : "ENGLISH"));
  };

  // --- Keydown handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        handleSendMessage();
      }
    }
  };

  // --- UI ---
  return (
    <div className="min-h-screen flex flex-col w-full items-center justify-center bg-transparent text-white p-6 relative overflow-hidden">
      {/* Blurred BG Animations */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
      </div>
      <div className="w-full max-w-2xl mx-auto relative">
        <motion.div
          className="relative z-10 space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* --- Chat Bubbles --- */}
          <div
            ref={chatContainerRef}
            className="space-y-4 mb-4 max-h-[350px] overflow-y-auto scrollbar-thin pr-2 hide-scrollbar scroll-auto"
          >
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.18 }}
                className={cn(
                  "flex w-full",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    // responsive, auto width, never too wide, allow scrolling if tall
                    "w-auto max-w-[75vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 py-2 rounded-lg shadow",
                    "break-words whitespace-pre-wrap",
                    "overflow-x-auto max-h-[300px] overflow-y-auto", // vertical scroll for tall content
                    msg.sender === "user"
                      ? "bg-violet-500/80 text-white"
                      : "bg-white/90 text-black"
                  )}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-500 hover:text-blue-600"
                        />
                      ),
                      // Fixed: Use `any` for code renderer to access `inline`
                      code: ({ inline, className, children, ...props }: any) =>
                        inline ? (
                          <code
                            className={cn(
                              "rounded px-1 py-0.5 font-mono bg-gray-800 text-white text-xs",
                              className
                            )}
                            {...props}
                          >
                            {children}
                          </code>
                        ) : (
                          <pre className="overflow-x-auto my-2">
                            <code
                              className={cn(
                                "rounded p-2 font-mono bg-gray-800 text-white text-xs block",
                                className
                              )}
                              {...props}
                            >
                              {children}
                            </code>
                          </pre>
                        ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-4 border-gray-400 pl-4 italic my-2 text-gray-600"
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc ml-5 my-2" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal ml-5 my-2" {...props} />
                      ),
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto">
                          <table className="table-auto border-collapse my-2" {...props} />
                        </div>
                      ),
                      th: ({ node, ...props }) => (
                        <th className="border px-2 py-1 bg-gray-200" {...props} />
                      ),
                      td: ({ node, ...props }) => (
                        <td className="border px-2 py-1" {...props} />
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex w-full justify-start">
                <div className="w-auto max-w-[75vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 py-2 rounded-lg bg-white/80 text-black flex items-center gap-2 break-words whitespace-pre-wrap overflow-x-auto max-h-[300px] overflow-y-auto">
                  <span>AssemblyBot is typing</span>
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* --- Input + Action Bar --- */}
          <motion.div
            className="relative backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-4">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask AssemblyBot a question..."
                className={cn(
                  "w-full px-4 py-3",
                  "resize-none",
                  "bg-transparent",
                  "border-none",
                  "text-white/90 text-sm",
                  "focus:outline-none",
                  "placeholder:text-white/20",
                  "min-h-[60px]"
                )}
                style={{
                  overflow: "hidden",
                }}
              />
            </div>
            <div className="p-4 border-t border-white/[0.05] flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLanguageToggle}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-sm font-medium transition-all shadow",
                    language === "HINDI"
                      ? "bg-orange-500/90 text-white hover:bg-orange-600/90"
                      : "bg-violet-600/80 text-white hover:bg-violet-700/90"
                  )}
                >
                  {language === "ENGLISH"
                    ? "Switch to Hindi"
                    : "Switch to English"}
                </button>
                <button
                  onClick={handleDeleteChats}
                  className="px-4 py-1.5 rounded-md bg-red-600/80 text-white text-sm font-medium hover:bg-red-700/90 shadow"
                >
                  Delete Chat
                </button>
              </div>
              <motion.button
                type="button"
                onClick={handleSendMessage}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isTyping || !value.trim()}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  "flex items-center gap-2",
                  value.trim()
                    ? "bg-white text-[#0A0A0B] shadow-lg shadow-white/10"
                    : "bg-white/[0.05] text-white/40"
                )}
              >
                {isTyping ? (
                  <LoaderIcon className="w-4 h-4 animate-[spin_2s_linear_infinite]" />
                ) : (
                  <SendIcon className="w-4 h-4" />
                )}
                <span>Send</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
