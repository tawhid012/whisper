import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy, Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertMessage, Message } from "@shared/schema";

export default function Home() {
  const [message, setMessage] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const createMessageMutation = useMutation({
    mutationFn: async (data: InsertMessage) => {
      const res = await apiRequest("POST", "/api/messages", data);
      return await res.json() as Message;
    },
    onSuccess: (data) => {
      const link = `${window.location.origin}/msg/${data.id}`;
      setGeneratedLink(link);
    },
    onError: (error) => {
      toast({
        title: "Failed to create message",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      createMessageMutation.mutate({ content: message });
    }
  };

  const handleCopy = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreateAnother = () => {
    setMessage("");
    setGeneratedLink(null);
    setCopied(false);
  };

  const charCount = message.length;
  const maxChars = 5000;

  if (generatedLink) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="border-l-4 border-l-chart-2 bg-card/50">
          <CardHeader className="gap-2 space-y-0 pb-4">
            <CardTitle className="text-2xl font-bold">Secret Link Created!</CardTitle>
            <CardDescription className="text-base">
              Share this link with your recipient. It will self-destruct after being opened once.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4 font-mono text-sm break-all" data-testid="text-generated-link">
              {generatedLink}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                variant="default"
                className="flex-1"
                data-testid="button-copy-link"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
            <button
              onClick={handleCreateAnother}
              className="text-sm text-primary hover-elevate active-elevate-2 underline underline-offset-4 w-full text-center py-2"
              data-testid="button-create-another"
            >
              Create Another Message
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card>
        <CardHeader className="gap-2 space-y-0 pb-6">
          <CardTitle className="text-2xl font-bold">Create Secret Message</CardTitle>
          <CardDescription className="text-base flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Your message will self-destruct after being read once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your secret message here..."
                className="min-h-[150px] resize-none"
                maxLength={maxChars}
                data-testid="input-message"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground" data-testid="text-char-count">
                  {charCount} / {maxChars}
                </p>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full py-6 text-base font-semibold tracking-wide uppercase"
              disabled={!message.trim() || createMessageMutation.isPending}
              data-testid="button-generate-link"
            >
              {createMessageMutation.isPending ? "Generating..." : "Generate Secret Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
