"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

export function useChatOpen() {
  return useQueryState("chatOpen", parseAsBoolean.withDefault(false));
}
