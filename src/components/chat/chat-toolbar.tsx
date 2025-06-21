import { Button } from "@/components/ui/button";
import { nanoid } from "@/lib/nanoid";
import { PlusIcon, X } from "lucide-react";
import { ChatSelector } from "./chat-selector";
import { useChatId } from "./use-chat-id";
import { useChatOpen } from "./use-chat-open";

interface ChatToolbarProps {
  onClose?: () => void;
}

export function ChatToolbar({ onClose }: ChatToolbarProps) {
  const [isOpen, setIsOpen] = useChatOpen();
  const [chatId, setChatId] = useChatId();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between p-2">
      <div className="flex items-center space-x-2">
        <ChatSelector />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setChatId(nanoid(16))}
          className="h-8 w-8 p-0"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClose}
        className="h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
