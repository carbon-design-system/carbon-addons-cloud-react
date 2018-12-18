const { execSync } = require('child_process');
const { inInstall } = require('in-publish');
const path = require('path');
const rimraf = require('rimraf');
const promisify = require('util-promisify');

if (inInstall()) {
  process.exit(0);
}

const rootDir = path.resolve(__dirname, '../');
const babelPath = path
  .resolve(__dirname, '../node_modules/.bin/babel')
  .replace(/ /g, '\\ ');
const rimrafAsync = promisify(rimraf);

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, extraEnv),
  });

console.log('Deleting old build folders...');
Promise.all([rimrafAsync(`${rootDir}/cjs`), rimrafAsync(`${rootDir}/es`)])
  .then(() => {
    exec(
      `${babelPath} src -q -d es -s --ignore "__tests__,__mocks__,*-story.js,*-test.js" src`,
      {
        BABEL_ENV: 'es',
      }
    );
    exec(
      `${babelPath} src -q -d lib -s --ignore "__tests__,__mocks__,*-story.js,*-test.js" src`,
      {
        BABEL_ENV: 'cjs',
      }
    );
  })
  .catch(error => {
    throw error;
  });
