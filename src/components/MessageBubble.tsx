import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

const MessageBubble = ({ content, sender, timestamp }: MessageBubbleProps) => {
  const isUser = sender === "user";

  return (
    <div className={cn("flex gap-3 mb-4", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
      </div>

      <div className={cn("flex flex-col gap-1 max-w-[80%]", isUser && "items-end")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-md"
              : "bg-card border border-border rounded-tl-md"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        <span className="text-xs text-muted-foreground px-1">{timestamp}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
