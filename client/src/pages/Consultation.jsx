import { useState, useRef, useEffect } from "react";
import { getAIResponse } from "../services/geminiAPI";
import { Sun, Moon, Plus, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import userAvatar from "../assets/userAvatar.jpg";
import aiAvatar from "../assets/aiAvatar.jpg";

const cleanResponse = (text) =>
  text.replace(/[*_`#>-]/g, "").replace(/\n{2,}/g, "\n").trim();

const Consultation = () => {
  const [conversations, setConversations] = useState(() => {
    return JSON.parse(localStorage.getItem("chatConversations")) || [];
  });

  const [activeChatIndex, setActiveChatIndex] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("activeChatIndex"));
    return saved ?? 0;
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiTypingText, setAiTypingText] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [renamingIndex, setRenamingIndex] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const chatEndRef = useRef(null);
  const activeMessages = conversations[activeChatIndex]?.messages || [];

  useEffect(() => {
    localStorage.setItem("chatConversations", JSON.stringify(conversations));
    localStorage.setItem("activeChatIndex", JSON.stringify(activeChatIndex));
  }, [conversations, activeChatIndex]);

  // useEffect(() => {
  //   chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [activeMessages, aiTypingText]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const updatedConversations = [...conversations];

    if (!updatedConversations[activeChatIndex]) {
      updatedConversations[activeChatIndex] = {
        title: input.slice(0, 20) + (input.length > 20 ? "... " : ""),
        messages: [userMsg],
      };
    } else {
      updatedConversations[activeChatIndex].messages.push(userMsg);
      if (
        !updatedConversations[activeChatIndex].title ||
        updatedConversations[activeChatIndex].title === "New Chat"
      ) {
        updatedConversations[activeChatIndex].title =
          input.slice(0, 20) + (input.length > 20 ? "..." : "");
      }
    }

    setConversations(updatedConversations);
    setInput("");
    setLoading(true);

    try {
      const reply = await getAIResponse(input);
      const cleaned = cleanResponse(reply);
      simulateTyping(cleaned);
    } catch {
      updatedConversations[activeChatIndex].messages.push({
        role: "ai",
        content:
          "⚠️ Sorry, I'm having trouble right now. Please try again later.",
      });
      setConversations(updatedConversations);
      setLoading(false);
    }
  };

  const simulateTyping = (text) => {
    let index = 0;
    setAiTypingText("");

    const interval = setInterval(() => {
      if (index < text.length) {
        setAiTypingText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        const updated = [...conversations];
        updated[activeChatIndex].messages.push({ role: "ai", content: text });
        setConversations(updated);
        setAiTypingText("");
        setLoading(false);
      }
    }, 20);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setConversations((prev) => [...prev, { title: "New Chat", messages: [] }]);
    setActiveChatIndex(conversations.length);
  };

  const handleDeleteChat = (index) => {
    const updated = conversations.filter((_, i) => i !== index);
    setConversations(updated);
    setActiveChatIndex(
      index === activeChatIndex ? 0 : Math.max(activeChatIndex - 1, 0)
    );
  };

  const handleRenameChat = (index) => {
    setRenamingIndex(index);
    setRenameValue(conversations[index].title);
  };

  const applyRename = () => {
    if (renameValue.trim()) {
      const updated = [...conversations];
      updated[renamingIndex].title = renameValue.trim();
      setConversations(updated);
    }
    setRenamingIndex(null);
    setRenameValue("");
  };

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"
        } w-64 p-5 border-r flex flex-col`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
            Smart AI
          </h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-700/30"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600" />
            )}
          </button>
        </div>

        <button
          onClick={handleNewChat}
          className="mb-4 bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
        >
          <Plus size={16} /> New Chat
        </button>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {conversations.map((conv, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`group flex items-center justify-between gap-2 p-2 rounded-lg cursor-pointer ${
                activeChatIndex === index
                  ? "bg-blue-600 text-white shadow"
                  : darkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-white text-gray-900 hover:bg-gray-200"
              }`}
            >
              {renamingIndex === index ? (
                <input
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={applyRename}
                  onKeyDown={(e) => e.key === "Enter" && applyRename()}
                  autoFocus
                  className="flex-1 bg-transparent border border-gray-300 px-2 py-1 rounded text-sm"
                />
              ) : (
                <div
                  onClick={() => setActiveChatIndex(index)}
                  className="flex-1 truncate text-sm"
                >
                  {conv.title}
                </div>
              )}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <Pencil
                  size={14}
                  onClick={() => handleRenameChat(index)}
                  className="cursor-pointer hover:text-yellow-400"
                />
                <Trash2
                  size={14}
                  onClick={() => handleDeleteChat(index)}
                  className="cursor-pointer text-red-500 hover:text-red-400"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1 relative">
        {/* Header */}
        <div
          className={`p-4 border-b font-semibold text-xl ${
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-300 bg-gray-100"
          }`}
        >
          AI Consultation
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 pb-36">
          {activeMessages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "ai" && (
                <img
                  src={aiAvatar}
                  className="w-8 h-8 mr-2 rounded-full shadow"
                  alt="AI"
                />
              )}
              <div
                className={`max-w-xl px-4 py-3 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed shadow-md
                  ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : `${
                          darkMode
                            ? "bg-gray-700 text-gray-100"
                            : "bg-gray-200 text-gray-800"
                        } rounded-bl-none`
                  }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <img
                  src={userAvatar}
                  className="w-8 h-8 ml-2 rounded-full shadow"
                  alt="User"
                />
              )}
            </motion.div>
          ))}

          {/* AI typing animation */}
          {aiTypingText && (
            <div className="flex items-start">
              <img
                src={aiAvatar}
                className="w-8 h-8 mr-2 rounded-full shadow"
                alt="AI"
              />
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                  darkMode
                    ? "bg-gray-700 text-gray-100"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <span className="animate-pulse">{aiTypingText}</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div
          className={`absolute bottom-14 left-1/2 transform -translate-x-1/2 w-[95%] px-6 py-4 rounded-2xl backdrop-blur-lg shadow-lg ${
            darkMode ? "bg-gray-800/90" : "bg-white/90 border border-gray-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className={`flex-1 resize-none p-3 rounded-lg outline-none shadow-inner ${
                darkMode
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-gray-100 text-gray-900 border border-gray-300 placeholder-gray-500"
              }`}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold shadow disabled:opacity-50"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultation;
