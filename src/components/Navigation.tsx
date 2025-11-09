import { Link, useLocation } from "react-router-dom";
import { MessageSquare, LayoutDashboard, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/chat", label: "New Chat", icon: MessageSquare },
    { to: "/intelligence", label: "Intelligence", icon: Brain },
  ];

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">AI Chat Portal</span>
          </div>

          <div className="flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                  "hover:bg-secondary/80",
                  location.pathname === to
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
