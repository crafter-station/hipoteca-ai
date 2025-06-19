import { getMessages } from "@/redis";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const messages = await getMessages(id);

  return Response.json(messages);
}
