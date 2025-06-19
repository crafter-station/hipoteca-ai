import { ChatPopup } from "@/components/chat";

export default function CheckrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ChatPopup />
    </>
  );
}
