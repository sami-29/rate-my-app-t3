function ensureAbsoluteURL(url: string): string {
  if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
    return `http://${url}`;
  }
  return url;
}

export default ensureAbsoluteURL;
