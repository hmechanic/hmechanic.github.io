// TypeScript 7 (native compiler) ships no JS compiler API, so typescript-eslint
// cannot parse with it. Give the lint toolchain its own TypeScript 6 while the
// project's `tsc` stays on 7. Drop this hook once typescript-eslint supports TS 7.
const TS_FOR_LINT = 'npm:typescript@~6.0.3';

function usesLintTypescript(name) {
  return name === 'typescript-eslint' || name === 'ts-api-utils' || name.startsWith('@typescript-eslint/');
}

module.exports = {
  hooks: {
    readPackage(pkg) {
      if (usesLintTypescript(pkg.name) && pkg.peerDependencies?.typescript) {
        delete pkg.peerDependencies.typescript;
        pkg.dependencies = { ...pkg.dependencies, typescript: TS_FOR_LINT };
      }
      return pkg;
    },
  },
};
