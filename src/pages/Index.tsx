import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ConversationCard from "@/components/ConversationCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const serverUrl = "http://localhost:8000"; // adjust if needed

interface Conversation {
  id: string;
  title: string;
  summary: string;
  started_at: string;
  messages?: any[];
}

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations from Django backend
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${serverUrl}/api/conversations/`);
        if (!res.ok) throw new Error("Failed to fetch conversations");
        const data = await res.json();
        console.log("data ", data);
        setConversations(data);
      } catch (err: any) {
        setError(err.message || "Error fetching conversations");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Filter conversations client-side
const filteredConversations = useMemo(() => {
  if (!conversations) return [];
  const query = searchQuery.toLowerCase();

  return conversations.filter((conv) => {
    const title = conv.title?.toLowerCase() || "";
    const summary = conv.summary?.toLowerCase() || "";
    return title.includes(query) || summary.includes(query);
  });
}, [conversations, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Conversations</h1>
            <p className="text-muted-foreground">
              View and search through your past conversations
            </p>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading conversations...
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              Failed to load: {error}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <ConversationCard
                    key={conversation.id}
                    title={conversation.title || "Untitled Conversation"}
                    summary={conversation.summary || "No summary available yet"}
                    date={new Date(conversation.started_at).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                    messageCount={conversation.messages?.length || 0}
                    onClick={() => navigate(`/conversation/${conversation.id}`,{state:conversation.messages})}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No conversations found
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
