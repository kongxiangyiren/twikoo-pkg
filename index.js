const { program } = require('commander');
const { join } = require('path');
const { existsSync, writeFileSync } = require('fs');
const { getAsset, isSea } = require('node:sea');

program
  .name(require('./package.json').name)
  .version(require('./package.json').dependencies.tkserver, '-v, --version')
  .description(
    `DESCRIPTION:
  Official website: https://twikoo.js.org/`
  )
  .helpCommand(false);

program.parse(process.argv);

try {
  if (isSea()) {
    // 创建.env文件
    if (!existsSync(join(__dirname, '.env'))) {
      writeFileSync(join(__dirname, '.env'), getAsset('.env', 'utf8'));
    }

    // 适配iis
    if (process.platform === 'win32' && !existsSync(join(__dirname, './web.config'))) {
      writeFileSync(join(__dirname, './web.config'), getAsset('web.config', 'utf8'));
    }

    // 拷贝ip2region.db
    if (!existsSync(join(__dirname, './ip2region.db'))) {
      writeFileSync(join(__dirname, './ip2region.db'), getAsset('ip2region.db', 'utf8'));
    }
  }
} catch (error) {}

// 获取env
require('dotenv').config({
  path: existsSync(join(__dirname, '.env')) ? join(__dirname, '.env') : undefined
});

// 匹配iis
if (process.env.ASPNETCORE_PORT) {
  process.env.TWIKOO_PORT = process.env.ASPNETCORE_PORT;
  process.env.TWIKOO_LOCALHOST_ONLY = null;
}

require('tkserver');
