import {LRLanguage, LanguageSupport} from "@codemirror/language"
import {html} from "@codemirror/lang-html"
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

const baseHTML = html()

function makeVue(base: LRLanguage) {
  return base.configure({
    dialect: "selfClosing",
    wrap: parseMixed(mixVue)
  }, "vue")
}

/// A language provider for Vue templates.
export const vueLanguage = makeVue(baseHTML.language as LRLanguage)

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
export function vue(config: {
  /// Provide an HTML language configuration to use as a base. _Must_
  /// be the result of calling `html()` from `@codemirror/lang-html`,
  /// not just any `LanguageSupport` object.
  base?: LanguageSupport
} = {}) {
  let base = baseHTML
  if (config.base) {
    if (config.base.language.name != "html" || !(config.base.language instanceof LRLanguage))
      throw new RangeError("The base option must be the result of calling html(...)")
    base = config.base
  }
  return new LanguageSupport(base.language == baseHTML.language ? vueLanguage : makeVue(base.language as LRLanguage), [
    base.support,
    base.language.data.of({closeBrackets: {brackets: ["{", '"']}})
  ])
}
