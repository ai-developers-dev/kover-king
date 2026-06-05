import { defineEventHandler, setResponseHeader, setResponseStatus } from "nitro/h3";
import { INDEXNOW_KEY } from "../../lib/indexnow";

// Serves the IndexNow key-verification file at /<key>.txt. IndexNow fetches
// this to confirm we own the key before accepting our submissions.
export default defineEventHandler((event) => {
  const param = (event.context.params as { key?: string } | undefined)?.key || "";
  const requested = param.replace(/\.txt$/, "");
  if (requested !== INDEXNOW_KEY) {
    setResponseStatus(event, 404);
    return "Not found";
  }
  setResponseHeader(event, "Content-Type", "text/plain");
  return INDEXNOW_KEY;
});
