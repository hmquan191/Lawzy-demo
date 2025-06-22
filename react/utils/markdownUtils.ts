/**
 * Convert markdown text to HTML
 * @param markdown The markdown text to convert
 * @returns HTML string
 */
export const markdownToHTML = (markdown: string): string => {
  // Convert headings
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Convert bold and italic
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Convert links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/gim,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>'
    )
    // Convert lists - improve list handling to avoid extra spacing
    .replace(/^\s*\n\* (.*)/gim, '<ul>\n<li>$1</li>')
    .replace(/^\* (.*)/gim, '<li>$1</li>')
    .replace(/^\s*\n- (.*)/gim, '<ul>\n<li>$1</li>')
    .replace(/^- (.*)/gim, '<li>$1</li>')
    // Convert code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-800 p-2 rounded my-2"><code>$1</code></pre>')
    // Convert inline code
    .replace(/`(.*?)`/gim, '<code class="bg-gray-800 px-1 rounded">$1</code>')
    // Convert paragraphs - only add paragraph breaks for actual empty lines
    .replace(/^\s*\n\s*\n/gim, '</p><p>')
    // Convert line breaks
    .replace(/\n/gim, '<br>')

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<p')) {
    html = '<p>' + html + '</p>'
  }

  // Ensure ul tags are properly closed
  html = html.replace(/<ul>(.*?)<\/ul>|(.*)$/s, (match, ulContent, rest) => {
    return ulContent ? `<ul>${ulContent}</ul>` : rest;
  });

  return html
} 