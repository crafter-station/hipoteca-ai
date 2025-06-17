"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { BookText, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { SummaryGenerator } from "./summary-generator";

interface ChatPanelProps {
  className?: string;
}

export function ChatPanel({ className }: ChatPanelProps) {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className={cn("flex h-full flex-col p-1", className)}>
      <Tabs defaultValue="chat" className="flex h-full flex-col">
        <TabsList className="grid h-9 w-full grid-cols-2 bg-muted/50">
          <TabsTrigger value="chat" className="h-7 text-xs sm:text-sm">
            <MessageSquare className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="summary" className="h-7 text-xs sm:text-sm">
            <BookText className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="chat"
          className="mt-2 flex flex-1 flex-col justify-between p-2 sm:p-3"
        >
          <div className="mb-3 flex-1 space-y-3 overflow-y-auto">
            {/* Empty state */}
            <div className="flex h-full flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <MessageSquare className="mb-3 h-8 w-8 text-muted-foreground/50 sm:h-10 sm:w-10" />
              <p className="mb-1 font-medium text-xs sm:text-sm">
                There are no messages in this chat, yet!
              </p>
              <p className="text-muted-foreground/70 text-xs">
                You can get started by asking something below.
              </p>
            </div>

            {/* Suggested Questions */}
            <div className="space-y-2">
              <h4 className="font-semibold text-muted-foreground text-xs sm:text-sm">
                Suggested Questions:
              </h4>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-full justify-start text-left text-xs sm:text-sm"
                  onClick={() =>
                    setMessage(
                      "What are the key terms in this mortgage contract?",
                    )
                  }
                >
                  What are the key terms in this mortgage contract?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-full justify-start text-left text-xs sm:text-sm"
                  onClick={() =>
                    setMessage("Are there any hidden fees or clauses?")
                  }
                >
                  Are there any hidden fees or clauses?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-full justify-start text-left text-xs sm:text-sm"
                  onClick={() =>
                    setMessage("What is the total cost of this mortgage?")
                  }
                >
                  What is the total cost of this mortgage?
                </Button>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Ask a question..."
              className="h-8 flex-1 text-xs sm:text-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              type="submit"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={!message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="summary" className="mt-2 flex-1 overflow-hidden">
          <SummaryGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
