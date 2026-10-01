export interface MarkdownSection {
  level: number;
  title: string;
  content: string;
  subSections: MarkdownSection[];
}

export function parseMarkdown(markdown: string): MarkdownSection[] {
  const lines = markdown.split('\n');
  
  const rootSections: MarkdownSection[] = [];
  const stack: MarkdownSection[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(#{1,6})\s+(.*)/);
    
    // Check for alternate underline heading styles like '---' or '==='
    const nextLine = lines[i + 1] || '';
    let isUnderlineHeading = false;
    let underlineLevel = 0;
    
    if (line.trim().length > 0 && !match && nextLine.trim().length >= 3) {
      if (/^={3,}$/.test(nextLine.trim())) {
        isUnderlineHeading = true;
        underlineLevel = 1;
      } else if (/^-{3,}$/.test(nextLine.trim())) {
        isUnderlineHeading = true;
        underlineLevel = 2;
      }
    }

    if (match || isUnderlineHeading) {
      const level = match ? match[1].length : underlineLevel;
      const title = match ? match[2].trim() : line.trim();
      
      const newSection: MarkdownSection = {
        level,
        title,
        content: '',
        subSections: []
      };

      if (isUnderlineHeading) {
        i++; // skip the underline line
      }

      // Pop stack until we find a parent with a strictly smaller level (higher hierarchy)
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        rootSections.push(newSection);
      } else {
        stack[stack.length - 1].subSections.push(newSection);
      }

      stack.push(newSection);
    } else {
      // Add content to the current section in the stack
      if (stack.length > 0) {
        stack[stack.length - 1].content += line + '\n';
      }
    }
  }

  // Clean up extra whitespace
  const cleanUp = (sections: MarkdownSection[]) => {
    for (const s of sections) {
      s.content = s.content.trim();
      cleanUp(s.subSections);
    }
  };
  cleanUp(rootSections);

  return rootSections;
}

/** Flatten sections into a 1D array for easier semantic matching if needed */
export function flattenSections(sections: MarkdownSection[]): MarkdownSection[] {
  const result: MarkdownSection[] = [];
  for (const s of sections) {
    result.push(s);
    result.push(...flattenSections(s.subSections));
  }
  return result;
}
