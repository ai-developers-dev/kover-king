// IndexNow — instantly notify participating search engines (Bing, Yandex,
// Seznam, and others) when a URL is published or updated. Free, no signup.
// The key is also served as a static file at /<key>.txt to prove ownership.
//
// Google does not officially consume IndexNow yet, but this costs nothing and
// speeds discovery on the engines that do. Google discovery still relies on the
// sitemap + Search Console.

export const INDEXNOW_KEY = "4f4ba7275ef4cf5543f6b3c155cbc7f8";
const HOST = "koverking.com";

/** Best-effort ping; never throws (must not block publishing). */
export async function pingIndexNow(urls: string[]): Promise<void> {
  const list = urls.filter(Boolean);
  if (list.length === 0) return;
  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList: list,
      }),
    });
  } catch {
    // Ignore — indexing notification is best-effort.
  }
}
