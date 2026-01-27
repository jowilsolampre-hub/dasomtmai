import { useEffect } from "react";
import { CyberCard } from "@/components/dasom/CyberCard";
import { useGoogleData, EmailPreview } from "@/hooks/useGoogleData";
import { useAuth } from "@/hooks/useAuth";
import { 
  Mail, 
  RefreshCw, 
  ExternalLink, 
  AlertCircle, 
  Loader2,
  User,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

function EmailCard({ email }: { email: EmailPreview }) {
  const fromName = email.from.split("<")[0].trim() || email.from;
  const timeAgo = formatDistanceToNow(new Date(email.date), { addSuffix: true });

  return (
    <CyberCard className="hover:border-primary/50 transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/20 shrink-0">
          <User className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-foreground truncate text-sm">
              {fromName}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo}
            </span>
          </div>
          <h4 className="font-medium text-foreground truncate mb-1">
            {email.subject}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {email.snippet}
          </p>
        </div>
      </div>
    </CyberCard>
  );
}

function EmailSkeleton() {
  return (
    <CyberCard>
      <div className="flex items-start gap-3">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    </CyberCard>
  );
}

export function InboxScreen() {
  const { isAuthenticated } = useAuth();
  const { 
    emails, 
    isLoadingEmails, 
    emailError, 
    fetchEmails,
    hasGoogleToken 
  } = useGoogleData();

  useEffect(() => {
    if (isAuthenticated && hasGoogleToken) {
      fetchEmails();
    }
  }, [isAuthenticated, hasGoogleToken]);

  if (!isAuthenticated) {
    return (
      <div className="p-4 space-y-4">
        <CyberCard className="text-center py-12">
          <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-orbitron text-lg font-bold text-foreground mb-2">
            GMAIL SYNC REQUIRED
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Sign in with Google to sync your inbox
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
            Your session doesn't include Gmail permissions. Please sign out and sign in again with Google.
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
          <div className="text-xs font-tech text-muted-foreground">GMAIL SYNC</div>
          <h2 className="font-orbitron text-2xl font-bold text-foreground">
            INBOX
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchEmails()}
          disabled={isLoadingEmails}
          className="border-primary/30"
        >
          {isLoadingEmails ? (
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
          {emails.length} MESSAGES
        </div>
      </div>

      {/* Error State */}
      {emailError && (
        <CyberCard className="border-destructive/30 bg-destructive/5">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <div>
              <div className="font-tech text-xs text-destructive">SYNC ERROR</div>
              <p className="text-sm text-foreground">{emailError}</p>
            </div>
          </div>
        </CyberCard>
      )}

      {/* Loading State */}
      {isLoadingEmails && emails.length === 0 && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <EmailSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Email List */}
      {!isLoadingEmails && emails.length === 0 && !emailError && (
        <CyberCard className="text-center py-8">
          <Mail className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No emails found</p>
        </CyberCard>
      )}

      <div className="space-y-3">
        {emails.map((email) => (
          <EmailCard key={email.id} email={email} />
        ))}
      </div>

      {/* Open Gmail */}
      {emails.length > 0 && (
        <Button
          variant="outline"
          className="w-full border-primary/30"
          onClick={() => window.open("https://mail.google.com", "_blank")}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Gmail
        </Button>
      )}
    </div>
  );
}
