import { useState, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import MessageBubble from "@/components/MessageBubble";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const serverUrl:String="http://localhost:8000"
let conversationId = "demo-session"; // normally you get this from backend when session starts

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isActive, setIsActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [conversationTitle,setconversationTitle]=useState(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
  const loadHistory = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/chat/conversation/${conversationId}/`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
        setIsActive(true);
      }
    } catch {}
  };
  loadHistory();
}, []);

const handleSend = async () => {
  if (!input.trim()) return;

  let createChat = false;
  if (!isActive) {
    createChat = true;
    setIsActive(true);
    toast({
      title: "Conversation Started",
      description: "You can now chat with the AI assistant",
    });
  }

  const userText = input;
  const tempId = Date.now().toString();

  const userMessage: Message = {
    id: tempId,
    content: userText,
    sender: "user",
    timestamp: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput("");

  try {
    // ✅ Create Conversation if needed
    if (createChat) {
      const res = await fetch(`${serverUrl}/api/conversations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to create conversation");

      const data = await res.json();
      console.log("data ",data)
      conversationId = data.id;
    }

    // ✅ Send Message
    const res = await fetch(`${serverUrl}/api/conversations/${conversationId}/send_message/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userText
      }),
    });

    if (!res.ok) throw new Error("Failed to send message");

    const data = await res.json();

    // ✅ Extract ai message
    const aiText = data.ai_message?.content;
    const aiId = data.ai_message?.id;

    const aiMessage: Message = {
      id: aiId || (Date.now() + 1).toString(),
      content: aiText,
      sender: "ai",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, aiMessage]);
  } catch (err) {
    console.error(err);
    toast({
      title: "Error",
      description: "Failed to connect to backend",
      variant: "destructive",
    });
  }
};


const handleEndConversation = async () => {
  if (messages.length === 0) {
    toast({
      title: "No conversation to end",
      description: "Start a conversation first",
      variant: "destructive",
    });
    return;
  }

  try {
   const res= await fetch(`${serverUrl}/api/conversations/${conversationId}/end/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation_id: conversationId }),
    });
    if(res.ok){
      const data=await res.json();
      setconversationTitle(data.title);
    }
  } catch {}

  toast({
    title: "Conversation Ended",
    description: "AI summary will be generated",
  });

  setIsActive(false);
  // setMessages([]);
};


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{conversationTitle?conversationTitle:"New Conversation"}</h1>
            {conversationTitle && 
            <p className="text-sm text-muted-foreground">
              {isActive ? "Conversation active" : "Start a conversation"}
            </p>}
          </div>
          {isActive && (
            <Button
              onClick={handleEndConversation}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <StopCircle className="w-4 h-4" />
              End Conversation
            </Button>
          )}
        </div>

        <div className="flex-1 bg-card border border-border rounded-lg p-6 mb-4 overflow-y-auto min-h-[500px]">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
                <p className="text-muted-foreground">
                  Type a message below to begin chatting with the AI
                </p>
              </div>
            </div>
          ) : (
            <div>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  content={message.content}
                  sender={message.sender}
                  timestamp={message.timestamp}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              className="min-h-[60px] resize-none"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="self-end gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
