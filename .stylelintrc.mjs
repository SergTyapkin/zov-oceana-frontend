import { propertyGroups } from 'stylelint-config-clean-order';

const propertiesOrder = propertyGroups.map(properties => ({
  noEmptyLineBetween: true,
  emptyLineBefore: 'never', // Don't add empty lines between order groups.
  properties,
}));

/** @type {import('stylelint').Config} */
export default {
  plugins: ['stylelint-order'],
  extends: ['stylelint-stylus/standard', 'stylelint-config-clean-order'],
  rules: {
    // Selector-list autofixes corrupt Stylus pseudo/attribute selectors in Vue SFCs.
    'stylus/selector-list-comma': null,
    'stylus/selector-list-comma-newline-after': null,
    'order/properties-order': [
      propertiesOrder,
      {
        severity: 'warning',
        unspecified: 'bottomAlphabetical',
      },
    ],
  },
  overrides: [
    {
      files: ['*.css'],
      extends: ['stylelint-config-standard'],
    },
  ],
};
