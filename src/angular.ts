import {LRLanguage, LanguageSupport} from "@codemirror/language"
import {htmlLanguage} from "@codemirror/lang-html"
import {javascriptLanguage} from "@codemirror/lang-javascript"
import {styleTags, tags as t} from "@lezer/highlight"
import {parseMixed, SyntaxNodeRef, Input} from "@lezer/common"
import {parser} from "./angular.grammar"

const exprParser = javascriptLanguage.parser.configure({
  top: "SingleExpression"
})

const baseParser = parser.configure({
  props: [
    styleTags({
      Text: t.content,
      Is: t.definitionOperator,
      AttributeName: t.attributeName,
      "AttributeValue ExpressionAttributeValue StatementAttributeValue": t.attributeValue,
      Entity: t.character,
      InvalidEntity: t.invalid,
      "BoundAttributeName/Identifier": t.attributeName,
      "EventName/Identifier": t.special(t.attributeName),
      "ReferenceName/Identifier": t.variableName,
      "DirectiveName/Identifier": t.keyword,
      "{{ }}": t.brace,
      "( )": t.paren,
      "[ ]": t.bracket,
      "# '*'": t.punctuation
    })
  ]
})

const exprMixed = {parser: exprParser}, statementMixed = {parser: javascriptLanguage.parser}

const textParser = baseParser.configure({
  wrap: parseMixed((node, input) => node.name == "InterpolationContent" ? exprMixed : null),
})

const attrParser = baseParser.configure({
  wrap: parseMixed((node, input) => node.name == "InterpolationContent" ? exprMixed
    : node.name != "AttributeInterpolation" ? null
    : node.node.parent?.name == "StatementAttributeValue" ? statementMixed : exprMixed),
  top: "Attribute"
})

const textMixed = {parser: textParser}, attrMixed = {parser: attrParser}

/// A language provider for Angular Templates.
export const angularLanguage = LRLanguage.define({
  name: "angular",
  parser: htmlLanguage.parser.configure({
    wrap: parseMixed(mixAngular)
  }),
  languageData: {
    closeBrackets: {brackets: ["[", "{", '"']},
    indentOnInput: /^\s*[\}\]]$/
  }
})

function mixAngular(node: SyntaxNodeRef, input: Input) {
  switch (node.name) {
    case "Attribute":
      return /^[*#(\[]|\{\{/.test(input.read(node.from, node.to)) ? attrMixed : null
    case "Text":
      return textMixed
  }
  return null
}

/// Angular Template language support.
export function angular() {
  return new LanguageSupport(angularLanguage)
}
