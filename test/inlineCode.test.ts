import { describe, expect, it } from 'vitest'
import { splitInlineCode } from '../app/utils/inlineCode'

describe('splitInlineCode', () => {
  it('returns plain text as one part', () => {
    expect(splitInlineCode('just text')).toEqual([{ text: 'just text', code: false }])
  })

  it('marks backticked parts as code and drops empty parts', () => {
    expect(splitInlineCode('`lin`, `lrm` and `lunar`')).toEqual([
      { text: 'lin', code: true },
      { text: ', ', code: false },
      { text: 'lrm', code: true },
      { text: ' and ', code: false },
      { text: 'lunar', code: true }
    ])
  })
})
