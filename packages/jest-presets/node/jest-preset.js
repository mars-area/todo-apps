/** @type {import('jest').Config} */
module.exports = {
  roots: ['<rootDir>'],
  // Let ts-jest handle TS and JS files so we can transform ESM JS in node_modules
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest'
  },
  // Allow transforming selected ESM dependencies under node_modules by
  // excluding them from the default ignore pattern. Add packages that
  // ship ESM (like @scure/bip39) here when tests need to import them.
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(?:@scure/bip39|@ethereumjs/wallet)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: [
    '<rootDir>/test/__fixtures__',
    '<rootDir>/dist'
  ],
  preset: 'ts-jest'
};
