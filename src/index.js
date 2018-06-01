import Parser, {plugins} from 'babylon/lib/parser'
import {TokenType, types} from 'babylon/lib/tokenizer/types'

const PLUGIN_NAME = 'match'

types.match = new TokenType('~/!~', {
  beforeExpr: true,
  binop: 6
})

const parser = Parser.prototype

// eslint-disable-next-line camelcase
parser.readToken_match = function readToken_match (code) {
  return this.finishOp(types.match, 2)
}

function plugin (instance) {
  instance.extend('readToken', (inner) => function readToken (code) {
    const current = String.fromCharCode(code)
    const previous = this.input.charAt(this.state.pos - 1)
    const next = this.input.charAt(this.state.pos + 1)

    if (current === '!' && next === '~') {
      return this.readToken_match(code)
    }

    if (previous !== '!' && current === '~') {
      return this.readToken_match(code)
    }

    return inner.call(this, code)
  })
}

plugins[PLUGIN_NAME] = plugin

export default function () {
  return {
    manipulateOptions (opts, parserOpts) {
      parserOpts.plugins.push(PLUGIN_NAME)
    }
  }
}
