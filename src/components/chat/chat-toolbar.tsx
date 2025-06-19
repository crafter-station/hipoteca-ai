import { Button } from "@/components/ui/button";
import { nanoid } from "@/lib/nanoid";
import { PlusIcon, X } from "lucide-react";
import { CardHeader } from "../ui/card";
import { ChatSelector } from "./chat-selector";
import { useChatId } from "./use-chat-id";
import { useChatOpen } from "./use-chat-open";

export function ChatToolbar() {
  const [isOpen, setIsOpen] = useChatOpen();
  const [chatId, setChatId] = useChatId();

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="flex items-center space-x-2">
        <ChatSelector />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setChatId(nanoid(16))}
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(false)}
        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <X className="h-4 w-4" />
      </Button>
    </CardHeader>
  );
}
