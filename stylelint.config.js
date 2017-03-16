module.exports = {
  extends: 'stylelint-config-suitcss',
  plugins: ['stylelint-order'],
  rules: {
    'no-missing-end-of-source-newline': null,
    'at-rule-empty-line-before': ['always', {
      except: ['inside-block']
    }],
    'number-leading-zero': 'never',
    'order/declaration-block-properties-alphabetical-order': null,
    'order/properties-order': require('./stylelint.order')
  }
}