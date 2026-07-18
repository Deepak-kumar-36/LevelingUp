export const extractLinks = (text: string): string[] => {
  const regex = /\[\[(.*?)\]\]/g;
  const links: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const link = match[1].trim();
    if (link) links.push(link);
  }
  return [...new Set(links)]; // Return unique targets
};

export const extractTags = (text: string): string[] => {
  const regex = /(?:^|\s)#([a-zA-Z0-9_-]+)/g;
  const tags: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    tags.push(match[1].toLowerCase());
  }
  return [...new Set(tags)];
};
