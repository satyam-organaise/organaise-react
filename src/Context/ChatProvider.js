import { createContext, useContext, useEffect, useState } from "react"
import { useLocation } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectChatV1, setSelectedChatV1] = useState([]);
    const [currentChats, setCurrentChats] = useState([]);
    const [chats , setChats] = useState([]);
    const location = useLocation();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if (!userInfo) {
            if (location.pathname !== "login") {
                localStorage.clear();
                window.location.href = "/login";
            }
        }
    }, [location])

    return (
        <ChatContext.Provider value={{ user, setUser, selectChatV1, setSelectedChatV1, currentChats, setCurrentChats ,chats , setChats }}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;