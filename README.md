<!-- NOTE: README.md is generated from src/README.md -->

# @codemirror/lang-vue [![NPM version](https://img.shields.io/npm/v/@codemirror/lang-vue.svg)](https://www.npmjs.org/package/@codemirror/lang-vue)

[ [**WEBSITE**](https://codemirror.net/) | [**ISSUES**](https://github.com/codemirror/dev/issues) | [**FORUM**](https://discuss.codemirror.net/c/next/) | [**CHANGELOG**](https://github.com/codemirror/lang-vue/blob/main/CHANGELOG.md) ]

This package implements Vue template support for the
[CodeMirror](https://codemirror.net/) code editor.

The [project page](https://codemirror.net/) has more information, a
number of [examples](https://codemirror.net/examples/) and the
[documentation](https://codemirror.net/docs/).

This code is released under an
[MIT license](https://github.com/codemirror/lang-json/tree/main/LICENSE).

We aim to be an inclusive, welcoming community. To make that explicit,
we have a [code of
conduct](http://contributor-covenant.org/version/1/1/0/) that applies
to communication around the project.

## API Reference

<dl>
<dt id="user-content-vue">
  <code><strong><a href="#user-content-vue">vue</a></strong>(<a id="user-content-vue^config" href="#user-content-vue^config">config</a>&#8288;?: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">Object</a> = {}) → <a href="https://codemirror.net/docs/ref#language.LanguageSupport">LanguageSupport</a></code></dt>

<dd><p>Vue template support.</p>
<dl><dt id="user-content-vue^config">
  <code><strong><a href="#user-content-vue^config">config</a></strong></code></dt>

<dd><dl><dt id="user-content-vue^config.base">
  <code><strong><a href="#user-content-vue^config.base">base</a></strong>&#8288;?: <a href="https://codemirror.net/docs/ref#language.LanguageSupport">LanguageSupport</a></code></dt>

<dd><p>Provide an HTML language configuration to use as a base. <em>Must</em>
be the result of calling <code>html()</code> from <code>@codemirror/lang-html</code>,
not just any <code>LanguageSupport</code> object.</p>
</dd></dl></dd></dl></dd>
<dt id="user-content-vuelanguage">
  <code><strong><a href="#user-content-vuelanguage">vueLanguage</a></strong>: <a href="https://codemirror.net/docs/ref#language.LRLanguage">LRLanguage</a></code></dt>

<dd><p>A language provider for Vue templates.</p>
</dd>
</dl>
