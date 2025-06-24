/* eslint-disable no-useless-escape */
export const markdownToHTML = (markdown: string): string => {
  // 🧹 Clean up empty code blocks like ```json```, ```ts```, etc.
  markdown = markdown.replace(/```(?:\w+)?\s*```/g, '')

  // ✅ Convert markdown tables to HTML
  markdown = markdown.replace(
    /\|(.+?)\|\n\|([:\-\| ]+)\|\n((\|.*\|\n?)*)/g,
    (match, headerLine, separator, bodyLines) => {
      const headers = headerLine
        .split('|')
        .map((h) => h.trim())
        .filter(Boolean)

      const rows = bodyLines
        .trim()
        .split('\n')
        .filter((line) => line.trim().startsWith('|')) // bỏ dòng rác
        .map((rowLine) => {
          const cells = rowLine
            .split('|')
            .map((cell) => cell.trim())
            .filter(Boolean)
          const tds = cells.map((c) => `<td class="border px-2 py-1">${c}</td>`).join('')
          return `<tr>${tds}</tr>`
        })
        .join('')

      const ths = headers.map((h) => `<th class="border px-2 py-1 bg-gray-100 text-left">${h}</th>`).join('')

      return `<table class="table-auto border-collapse border my-4 text-sm"><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`
    }
  )

  // 🔄 Convert markdown syntax
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-2">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/gim,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>'
    )
    .replace(/^\s*\n\* (.*)/gim, '<ul><li>$1</li>')
    .replace(/^\* (.*)/gim, '<li>$1</li>')
    .replace(/^\s*\n- (.*)/gim, '<ul><li>$1</li>')
    .replace(/^- (.*)/gim, '<li>$1</li>')
    .replace(
      /```([\s\S]*?)```/gim,
      '<pre class="bg-gray-800 p-2 rounded my-2 text-sm text-white overflow-auto"><code>$1</code></pre>'
    )
    .replace(/`(.*?)`/gim, '<code class="bg-gray-800 px-1 rounded text-white">$1</code>')
    .replace(/^\s*\n\s*\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>')

  // ✅ Ensure paragraph wrapper
  if (!html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<p') && !html.startsWith('<table')) {
    html = '<p>' + html + '</p>'
  }

  // ✅ Auto-close ul if necessary
  html = html.replace(/<ul>(?![\s\S]*?<\/ul>)([\s\S]*?)<\/li>/gim, '<ul>$1</li></ul>')

  return html
}
