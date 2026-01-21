import { useState } from "react";
import { CyberCard } from "@/components/dasom/CyberCard";
import { useDasomChat } from "@/hooks/useDasomChat";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle,
  Plus,
  ChevronRight,
  Mic,
  CheckCircle2,
  Circle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  type: "task" | "meeting" | "reminder" | "automated";
  location?: string;
  completed?: boolean;
  tags?: string[];
}

export function ScheduleScreen() {
  const [currentDate] = useState(new Date());
  const { sendMessage, isLoading } = useDasomChat("schedule");

  const [events] = useState<ScheduleEvent[]>([
    {
      id: "1",
      title: "Review Q3 Financial Reports",
      time: "18:00",
      type: "task",
      tags: ["FINANCE", "ANALYTICS"],
    },
    {
      id: "2",
      title: "Lunch with Client - Nexus Hub",
      time: "12:30",
      type: "meeting",
      location: "Downtown",
    },
    {
      id: "3",
      title: "Communication Protocol Follow-ups",
      time: "15:00",
      type: "automated",
      tags: ["EMAIL", "BATCH_PROCESS"],
    },
    {
      id: "4",
      title: "Morning Sync: Dev Team",
      time: "09:00",
      type: "meeting",
      completed: true,
    },
  ]);

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDayIndex = currentDate.getDay();

  const formatDate = () => {
    return currentDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).toUpperCase();
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-tech text-muted-foreground">CURRENT CYCLE</div>
          <h2 className="font-orbitron text-2xl font-bold text-foreground">
            {formatDate()}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">☀</span>
          <span className="text-foreground">72°F</span>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex gap-2">
        <div className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-xs font-tech text-primary">
          ⚡ HIGH DENSITY
        </div>
        <div className="px-3 py-1.5 rounded-full bg-success/20 border border-success/30 text-xs font-tech text-success">
          ✓ FOCUS MODE READY
        </div>
      </div>

      {/* Week Calendar */}
      <CyberCard>
        <div className="flex items-center justify-between mb-3">
          <span className="font-tech text-xs text-muted-foreground uppercase">
            WEEK {Math.ceil(currentDate.getDate() / 7) + Math.floor((currentDate.getMonth() * 4))}
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex justify-between">
          {weekDays.map((day, i) => {
            const dayNum = currentDate.getDate() - currentDayIndex + i;
            const isToday = i === currentDayIndex;
            return (
              <div
                key={i}
                className={`flex flex-col items-center p-2 rounded-lg ${
                  isToday 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground'
                }`}
              >
                <span className="text-xs font-tech">{day}</span>
                <span className={`text-lg font-orbitron ${isToday ? 'font-bold' : ''}`}>
                  {dayNum}
                </span>
              </div>
            );
          })}
        </div>
      </CyberCard>

      {/* DASOM Insight */}
      <CyberCard className="bg-primary/5 border-primary/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <AlertTriangle className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-tech text-xs text-primary mb-1">DASOM INSIGHT</div>
            <p className="text-sm text-foreground mb-2">
              Traffic density is unusually high on Route 4. Recommend departure at{" "}
              <span className="text-primary font-semibold">1:50 PM</span>. You have a 15m 
              window to decompress after your 2 PM.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="border-primary/30"
              onClick={() => sendMessage("Show me the optimal route to my next appointment")}
            >
              View Route
            </Button>
          </div>
        </div>
      </CyberCard>

      {/* Events List */}
      <div className="space-y-3">
        {events.map((event) => (
          <CyberCard 
            key={event.id}
            className={event.completed ? 'opacity-60' : ''}
          >
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center min-w-[50px]">
                <span className="font-tech text-xs text-muted-foreground">
                  {event.time}
                </span>
                {event.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-success mt-1" />
                ) : (
                  <Circle className="w-5 h-5 text-primary mt-1" />
                )}
              </div>
              <div className="flex-1 border-l border-primary/20 pl-3">
                <div className="flex items-center gap-2 mb-1">
                  {event.type === "automated" && (
                    <span className="text-xs font-tech text-accent">⚡ AI_AUTOMATED</span>
                  )}
                  {event.type === "task" && (
                    <span className="text-xs font-tech text-warning">★ HIGH_PRIORITY</span>
                  )}
                </div>
                <h4 className={`font-semibold text-foreground ${event.completed ? 'line-through' : ''}`}>
                  {event.title}
                </h4>
                {event.location && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </div>
                )}
                {event.tags && (
                  <div className="flex gap-1 mt-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-tech bg-primary/10 text-primary rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {event.completed && (
                  <span className="text-xs text-success font-tech">NOW 08:15</span>
                )}
              </div>
            </div>
          </CyberCard>
        ))}
      </div>

      {/* Add New */}
      <div className="fixed bottom-24 right-4">
        <Button
          size="icon"
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/80 shadow-lg shadow-primary/30"
          onClick={() => sendMessage("Create a new calendar event")}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Voice Input */}
      <CyberCard className="mt-4">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            className="text-primary"
            onClick={() => sendMessage("What's on my schedule for today?")}
          >
            <Mic className="w-5 h-5" />
          </Button>
          <input
            type="text"
            placeholder="Deploy new objective..."
            className="flex-1 bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
          />
          <Button
            size="icon"
            className="bg-primary text-primary-foreground"
            onClick={() => sendMessage("Add a new task to my schedule")}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CyberCard>
    </div>
  );
}
