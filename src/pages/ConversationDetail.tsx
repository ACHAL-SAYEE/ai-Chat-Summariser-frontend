import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import MessageBubble from "@/components/MessageBubble";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ConversationDetail = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const conversation = location.state;

  if (!conversation) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Conversation Not Found</h1>
            <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
          </div>
        </main>
      </div>
    );
  }

  const sortedMessages = [...conversation].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  let lastDate = null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          size="sm"
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="bg-card border border-border rounded-lg p-6 mb-4">
          <h1 className="text-2xl font-bold mb-2">{conversation.title}</h1>
          <p className="text-sm text-muted-foreground mb-4">
            {formatDate(conversation.started_at || sortedMessages[0]?.timestamp)}
          </p>

          {conversation.summary && (
            <div className="bg-secondary/50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold mb-2">AI Summary</h3>
              <p className="text-sm text-muted-foreground">{conversation.summary}</p>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Conversation History</h2>

          {sortedMessages.length > 0 ? (
            sortedMessages.map((message, index) => {
              const messageDate = formatDate(message.timestamp);
              const showDate = messageDate !== lastDate;
              lastDate = messageDate;

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="text-center my-4">
                      <span className="text-xs font-semibold text-muted-foreground bg-secondary/30 px-3 py-1 rounded-full">
                        {messageDate}
                      </span>
                    </div>
                  )}
                  <MessageBubble
                    content={message.content}
                    sender={message.sender}
                    timestamp={formatTime(message.timestamp)} 
                  />
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No messages in this conversation</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConversationDetail;
