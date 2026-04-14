import { defineEventHandler, getQuery, createError } from "nitro/h3";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  const mode = query["hub.mode"];
  const token = query["hub.verify_token"];
  const challenge = query["hub.challenge"];

  if (mode !== "subscribe") {
    throw createError({ statusCode: 400, message: "Invalid mode" });
  }

  const verifyToken = process.env.META_VERIFY_TOKEN;
  if (!verifyToken || token !== verifyToken) {
    throw createError({ statusCode: 403, message: "Token mismatch" });
  }

  event.node.res.setHeader("Content-Type", "text/plain");
  return challenge;
});
