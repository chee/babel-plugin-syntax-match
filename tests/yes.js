process.env.NODE_ENV = 'test'

const path = require('path')

const {transform} = require('babel-core')

const test = require('tape')

const babelOptions = {
  plugins: [path.join(__dirname, '../lib')]
}

test('correct code parses', t => {
  t.plan(2)

  t.doesNotThrow(() => transform(`
    const something = sausage ~ /abc/;
  `, babelOptions))

  t.doesNotThrow(() => transform(`
    const prince = "cool" !~ /ranch/;
  `, babelOptions))
})

test('bad code doesnt pass', t => {
  t.plan(2)

  t.throws(() => {
    return transform(`
      const pingu ~ /abc/;
    `, babelOptions)
  }, /Unexpected token/)

  t.throws(() => {
    return transform(`
      const ~ 1;
    `, babelOptions)
  }, /Unexpected token/)
})
