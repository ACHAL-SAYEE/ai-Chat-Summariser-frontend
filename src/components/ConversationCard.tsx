import { MessageSquare, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ConversationCardProps {
  title: string;
  summary: string;
  date: string;
  messageCount: number;
  onClick: () => void;
}

const ConversationCard = ({ title, summary, date, messageCount, onClick }: ConversationCardProps) => {
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-200",
        "hover:shadow-md hover:border-primary/30",
        "bg-card border-border"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1 truncate">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{summary}</p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{messageCount} messages</span>
            </div>
          </div>
        </div>

        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
      </div>
    </Card>
  );
};

export default ConversationCard;
