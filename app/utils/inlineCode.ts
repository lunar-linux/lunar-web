export type TextPart = { text: string, code: boolean }

/**
 * Splits plain text from an MDC component's YAML block at backticks, so `lrm nano` can be shown as
 * inline code: "run `lrm`" → [{ text: 'run ', code: false }, { text: 'lrm', code: true }].
 * Empty parts are dropped.
 */
export const splitInlineCode = (text: string): TextPart[] =>
  text.split('`')
    .map((part, index) => ({ text: part, code: index % 2 === 1 }))
    .filter(part => part.text !== '')
