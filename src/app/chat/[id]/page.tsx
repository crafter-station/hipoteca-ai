import { Chat } from "@/components/ui/chat";
import { getMessages } from "@/redis/set-messages";

export default async function Page(props: { params: Promise<{ id: string }> }) {
	const { id } = await props.params; // get the chat ID from the URL
	const messages = await getMessages(id); // load the chat messages
	return <Chat id={id} initialMessages={messages} />; // display the chat
}
