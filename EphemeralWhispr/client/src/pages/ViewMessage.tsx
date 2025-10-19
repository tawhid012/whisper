import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import type { Message } from "@shared/schema";

export default function ViewMessage() {
  const params = useParams<{ id: string }>();
  const messageId = params.id;

  const { data: message, isLoading, error } = useQuery<Message>({
    queryKey: ["/api/messages", messageId],
    queryFn: async () => {
      const res = await fetch(`/msg/${messageId}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("expired");
        }
        throw new Error("Failed to load message");
      }
      return res.json();
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-16">
            <div className="text-center space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mx-auto mb-4"></div>
                <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
              </div>
              <p className="text-muted-foreground">Loading message...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="border-destructive/50">
          <CardContent className="py-16">
            <div className="text-center space-y-6 animate-in fade-in duration-300">
              <div className="text-6xl" data-testid="text-expired-emoji">💨</div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold" data-testid="text-expired-title">
                  Message Expired
                </h2>
                <p className="text-muted-foreground" data-testid="text-expired-description">
                  This secret message has already been read and has self-destructed.
                </p>
              </div>
              <Link href="/">
                <Button variant="default" data-testid="button-create-own">
                  Create Your Own
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-in fade-in duration-300">
      <Card>
        <CardHeader className="gap-2 space-y-0 pb-6">
          <CardTitle className="text-2xl font-bold">Secret Message</CardTitle>
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4" />
            <span>This message will be deleted after you close this page</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <div 
              className="bg-muted rounded-lg p-6 whitespace-pre-wrap break-words"
              data-testid="text-message-content"
            >
              {message.content}
            </div>
          </div>
          <div className="mt-6">
            <Link href="/">
              <Button variant="outline" className="w-full" data-testid="button-home">
                Create Your Own Secret Message
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
