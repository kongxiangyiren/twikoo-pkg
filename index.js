const { program } = require('commander');
const { join } = require('path');
const { existsSync, writeFileSync, readFileSync } = require('fs');

program
  .name(require('./package.json').name)
  .version(require('./package.json').dependencies.tkserver, '-v, --version')
  .description(
    `DESCRIPTION:
  Official website: https://twikoo.js.org/`
  )
  .addHelpCommand(false);

program.parse(process.argv);

if (
  process.pkg &&
  !existsSync(join(process.execPath, '..', '.env')) &&
  existsSync(join(__dirname, '.env'))
) {
  writeFileSync(
    join(process.execPath, '..', '.env'),
    readFileSync(join(__dirname, '.env'), 'utf-8')
  );
}

require('dotenv').config({
  path:
    process.pkg && existsSync(join(process.execPath, '..', '.env'))
      ? join(process.execPath, '..', '.env')
      : existsSync(join(__dirname, '.env'))
      ? join(__dirname, '.env')
      : void 0
});

require('tkserver');
