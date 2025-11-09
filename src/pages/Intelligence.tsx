import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Brain, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QueryResult {
  query: string;
  response: string;
  relevantConversations: string[];
}

const serverUrl = "http://localhost:8000"; // backend base URL

const Intelligence = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QueryResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);

    try {
      const res = await fetch(`${serverUrl}/api/conversations/query_past/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      // The backend currently returns:
      // { "answer": "AI-generated text" }
      // So we map it to our QueryResult shape
      const newResult: QueryResult = {
        query: query,
        response:
          data.answer ||
          "No response from backend. Check if your AI pipeline returned data.",
        relevantConversations: data.relevant || [], // optional if you extend backend
      };

      setResults((prev) => [newResult, ...prev]);
      setQuery("");
    } catch (err) {
      console.error("Error fetching AI response:", err);
      toast({
        title: "Error",
        description:
          "Failed to reach the backend. Please ensure your Django server is running on port 8000.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Conversation Intelligence</h1>
              <p className="text-muted-foreground">
                Ask questions about your past conversations
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6 mb-8 bg-card border-border">
          <h3 className="font-semibold mb-4">Ask a Question</h3>
          <div className="space-y-4">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Examples:&#10;- What did I discuss about travel last week?&#10;- Summarize my conversations about machine learning&#10;- What project ideas were suggested to me?&#10;- What are the key topics from my recent chats?"
              className="min-h-[120px] resize-none"
            />
            <Button
              onClick={handleSearch}
              disabled={!query.trim() || isSearching}
              className="w-full gap-2"
            >
              <Search className="w-4 h-4" />
              {isSearching ? "Searching..." : "Search Conversations"}
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          {results.length > 0 ? (
            results.map((result, index) => (
              <Card key={index} className="p-6 bg-card border-border">
                <div className="mb-4">
                  <div className="text-sm font-medium text-primary mb-2">
                    Your Query
                  </div>
                  <p className="text-foreground">{result.query}</p>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-accent mb-2">
                    AI Response
                  </div>
                  <p className="text-foreground whitespace-pre-line">
                    {result.response}
                  </p>
                </div>

                {result.relevantConversations.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Referenced Conversations
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.relevantConversations.map((conv, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-secondary rounded-full text-xs"
                        >
                          {conv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No queries yet</h3>
              <p className="text-muted-foreground">
                Ask a question about your past conversations to get started
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Intelligence;
