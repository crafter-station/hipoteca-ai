import { Suspense } from "react";

export async function AppSidebar() {
  return <Suspense fallback={<div>.</div>}></Suspense>;
}
