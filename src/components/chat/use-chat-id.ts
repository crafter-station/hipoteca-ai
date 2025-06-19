"use client";

import { parseAsString, useQueryState } from "nuqs";

export function useChatId() {
  return useQueryState("chatId", parseAsString);
}
