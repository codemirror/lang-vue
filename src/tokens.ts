import {ExternalTokenizer} from "@lezer/lr"
import {Text, attributeContentSingle, attributeContentDouble,
        scriptAttributeContentSingle, scriptAttributeContentDouble} from "./angular.grammar.terms"

const enum Ch {
  Newline = 10,
  DoubleQuote = 34,
  Ampersand = 38,
  SingleQuote = 39,
  BraceL = 123, BraceR = 125,
}

export const text = new ExternalTokenizer(input => {
  let start = input.pos
  for (;;) {
    if (input.next == Ch.Newline) {
      input.advance()
      break
    } else if (input.next == Ch.BraceL && input.peek(1) == Ch.BraceL || input.next < 0) {
      break
    }
    input.advance()
  }
  if (input.pos > start) input.acceptToken(Text)
})

function attrContent(quote: number, token: number, script: boolean) {
  return new ExternalTokenizer(input => {
    let start = input.pos
    while (input.next != quote && input.next >= 0 &&
           (script || input.next != Ch.Ampersand && (input.next != Ch.BraceL || input.peek(1) != Ch.BraceL)))
      input.advance()
    if (input.pos > start) input.acceptToken(token)
  })
}

export const attrSingle = attrContent(Ch.SingleQuote, attributeContentSingle, false)
export const attrDouble = attrContent(Ch.DoubleQuote, attributeContentDouble, false)
export const scriptAttrSingle = attrContent(Ch.SingleQuote, scriptAttributeContentSingle, true)
export const scriptAttrDouble = attrContent(Ch.DoubleQuote, scriptAttributeContentDouble, true)
