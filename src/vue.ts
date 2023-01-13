import {LRLanguage, LanguageSupport} from "@codemirror/language"
import {htmlLanguage} from "@codemirror/lang-html"
import {javascriptLanguage} from "@codemirror/lang-javascript"
import {styleTags, tags as t} from "@lezer/highlight"
import {parseMixed, SyntaxNodeRef, Input} from "@lezer/common"
import {parser} from "./vue.grammar"

const exprParser = javascriptLanguage.parser.configure({
  top: "SingleExpression"
})

const baseParser = parser.configure({
  props: [
    styleTags({
      Text: t.content,
      Is: t.definitionOperator,
      AttributeName: t.attributeName,
      VueAttributeName: t.keyword,
      Identifier: t.variableName,
      "AttributeValue ScriptAttributeValue": t.attributeValue,
      Entity: t.character,
      "{{ }}": t.brace,
      "@ :": t.punctuation
    })
  ]
})

const exprMixed = {parser: exprParser}

const textParser = baseParser.configure({
  wrap: parseMixed((node, input) => node.name == "InterpolationContent" ? exprMixed : null),
})

const attrParser = baseParser.configure({
  wrap: parseMixed((node, input) => node.name == "AttributeScript" ? exprMixed : null),
  top: "Attribute"
})

const textMixed = {parser: textParser}, attrMixed = {parser: attrParser}

/// A language provider for Vue templates.
export const vueLanguage = LRLanguage.define({
  name: "vue",
  parser: htmlLanguage.parser.configure({wrap: parseMixed(mixVue)}),
  languageData: {
    closeBrackets: {brackets: ["{", '"']}
  }
})

function mixVue(node: SyntaxNodeRef, input: Input) {
  switch (node.name) {
    case "Attribute":
      return /^(@|:|v-)/.test(input.read(node.from, node.from + 2)) ? attrMixed : null
    case "Text":
      return textMixed
  }
  return null
}

/// Vue template support.
export function vue() {
  return new LanguageSupport(vueLanguage)
}
