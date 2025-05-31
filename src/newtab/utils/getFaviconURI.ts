export const getFaviconURI = (uri: string, size: number) => {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", uri);
  url.searchParams.set("size", size.toString());
  return url.toString();
};
