import { useState, useRef, useEffect } from "react";
import { getAIResponse } from "../services/geminiAPI";
import { Sun, Moon, Plus, Pencil, Trash2 } from "lucide-react";
import userAvatar from "../assets/userAvatar.jpg";
import aiAvatar from "../assets/aiAvatar.jpg";

const cleanResponse = (text) => {
  return text
    .replace(/[*_`#>-]/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
};

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

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const updatedConversations = [...conversations];

    if (!updatedConversations[activeChatIndex]) {
      updatedConversations[activeChatIndex] = {
        title: input.slice(0, 20) + (input.length > 20 ? "..." : ""),
        messages: [userMsg],
      };
    } else {
      updatedConversations[activeChatIndex].messages.push(userMsg);
      if (!updatedConversations[activeChatIndex].title || updatedConversations[activeChatIndex].title === "New Chat") {
        updatedConversations[activeChatIndex].title = input.slice(0, 20) + (input.length > 20 ? "..." : "");
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
        content: "Sorry, I'm having trouble right now. Please try again later.",
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
    setConversations((prev) => [
      ...prev,
      { title: "New Chat", messages: [] },
    ]);
    setActiveChatIndex(conversations.length);
  };

  const handleDeleteChat = (index) => {
    const updated = conversations.filter((_, i) => i !== index);
    setConversations(updated);
    setActiveChatIndex(index === activeChatIndex ? 0 : Math.max(activeChatIndex - 1, 0));
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
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Sidebar */}
      <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"} w-64 p-5 border-r flex flex-col`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Smart AI</h2>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <button
          onClick={handleNewChat}
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} /> New Chat
        </button>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv, index) => (
            <div
              key={index}
              className={`group flex items-center justify-between gap-2 p-2 mb-2 rounded-lg cursor-pointer ${
                activeChatIndex === index
                  ? "bg-blue-600 text-white"
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
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                <Pencil size={14} onClick={() => handleRenameChat(index)} className="cursor-pointer" />
                <Trash2 size={14} onClick={() => handleDeleteChat(index)} className="cursor-pointer text-red-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1 relative">
        <div className={`p-4 border-b ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-100"} text-xl font-semibold`}>
          AI Consultation
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6 pb-36">
          {activeMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && <img src={aiAvatar} className="w-8 h-8 mr-2 rounded-full" alt="AI" />}
              <div
                className={`max-w-xl px-4 py-3 rounded-xl whitespace-pre-wrap text-sm leading-relaxed shadow-md
                  ${msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : `${darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-200 text-gray-800"} rounded-bl-none`}`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && <img src={userAvatar} className="w-8 h-8 ml-2 rounded-full" alt="User" />}
            </div>
          ))}

          {aiTypingText && (
            <div className="flex items-start">
              <img src={aiAvatar} className="w-8 h-8 mr-2 rounded-full" alt="AI" />
              <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed shadow-md ${darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-200 text-gray-800"}`}>
                {aiTypingText}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className={`absolute bottom-14 left-32 w-4/5 px-6 py-4 rounded-xl ${darkMode ? "bg-gray-800 border-t border-gray-700" : "bg-gray-100 border-t border-gray-300"}`}>
          <div className="flex items-center gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className={`flex-1 resize-none p-3 rounded-lg outline-none ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900 border border-gray-300"}`}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultation;
