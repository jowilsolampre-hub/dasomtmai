import { useEffect } from "react";
import { CyberCard } from "@/components/dasom/CyberCard";
import { useGoogleData, CalendarEvent } from "@/hooks/useGoogleData";
import { useAuth } from "@/hooks/useAuth";
import { 
  Calendar, 
  RefreshCw, 
  ExternalLink, 
  AlertCircle, 
  Loader2,
  MapPin,
  Clock,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isToday, isTomorrow, parseISO } from "date-fns";

function formatEventTime(event: CalendarEvent) {
  if (event.isAllDay) {
    return "All day";
  }
  const start = parseISO(event.startTime);
  const end = parseISO(event.endTime);
  return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
}

function formatEventDate(event: CalendarEvent) {
  const date = parseISO(event.startTime);
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "EEE, MMM d");
}

function EventCard({ event }: { event: CalendarEvent }) {
  return (
    <CyberCard className="hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center min-w-[50px] text-center">
          <span className="text-xs font-tech text-primary uppercase">
            {formatEventDate(event)}
          </span>
          <div className="p-2 rounded-lg bg-primary/20 mt-1">
            <CalendarDays className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="flex-1 border-l border-primary/20 pl-3">
          <h4 className="font-semibold text-foreground mb-1">
            {event.title}
          </h4>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <Clock className="w-3 h-3" />
            {formatEventTime(event)}
          </div>
          {event.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.description && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </CyberCard>
  );
}

function EventSkeleton() {
  return (
    <CyberCard>
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center min-w-[50px]">
          <Skeleton className="h-3 w-12 mb-1" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
        <div className="flex-1 border-l border-primary/20 pl-3 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </CyberCard>
  );
}

export function CalendarScreen() {
  const { isAuthenticated } = useAuth();
  const { 
    events, 
    isLoadingEvents, 
    calendarError, 
    fetchCalendarEvents,
    hasGoogleToken 
  } = useGoogleData();

  useEffect(() => {
    if (isAuthenticated && hasGoogleToken) {
      fetchCalendarEvents();
    }
  }, [isAuthenticated, hasGoogleToken]);

  if (!isAuthenticated) {
    return (
      <div className="p-4 space-y-4">
        <CyberCard className="text-center py-12">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-orbitron text-lg font-bold text-foreground mb-2">
            CALENDAR SYNC REQUIRED
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Sign in with Google to sync your calendar
          </p>
        </CyberCard>
      </div>
    );
  }

  if (!hasGoogleToken) {
    return (
      <div className="p-4 space-y-4">
        <CyberCard className="text-center py-12 border-warning/30">
          <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h3 className="font-orbitron text-lg font-bold text-foreground mb-2">
            GOOGLE TOKEN MISSING
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Your session doesn't include Calendar permissions. Please sign out and sign in again with Google.
          </p>
        </CyberCard>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-tech text-muted-foreground">GOOGLE CALENDAR</div>
          <h2 className="font-orbitron text-2xl font-bold text-foreground">
            UPCOMING
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchCalendarEvents()}
          disabled={isLoadingEvents}
          className="border-primary/30"
        >
          {isLoadingEvents ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Status Badge */}
      <div className="flex gap-2">
        <div className="px-3 py-1.5 rounded-full bg-success/20 border border-success/30 text-xs font-tech text-success">
          ✓ SYNCED
        </div>
        <div className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-xs font-tech text-primary">
          {events.length} EVENTS
        </div>
      </div>

      {/* Today's Summary */}
      {events.length > 0 && (
        <CyberCard className="bg-primary/5 border-primary/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-tech text-xs text-primary">NEXT 7 DAYS</div>
              <p className="text-sm text-foreground">
                You have {events.length} upcoming event{events.length !== 1 ? "s" : ""} scheduled
              </p>
            </div>
          </div>
        </CyberCard>
      )}

      {/* Error State */}
      {calendarError && (
        <CyberCard className="border-destructive/30 bg-destructive/5">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <div>
              <div className="font-tech text-xs text-destructive">SYNC ERROR</div>
              <p className="text-sm text-foreground">{calendarError}</p>
            </div>
          </div>
        </CyberCard>
      )}

      {/* Loading State */}
      {isLoadingEvents && events.length === 0 && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <EventSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Events List */}
      {!isLoadingEvents && events.length === 0 && !calendarError && (
        <CyberCard className="text-center py-8">
          <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No upcoming events</p>
        </CyberCard>
      )}

      <div className="space-y-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Open Google Calendar */}
      {events.length > 0 && (
        <Button
          variant="outline"
          className="w-full border-primary/30"
          onClick={() => window.open("https://calendar.google.com", "_blank")}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Google Calendar
        </Button>
      )}
    </div>
  );
}
