const { execSync } = require('child_process');
const { rmSync, renameSync, mkdirSync, cpSync, writeFileSync } = require('fs');

const seaConfig = {
  main: './build/index.js',
  output: 'sea-prep.blob',
  disableExperimentalSEAWarning: true,
  assets: {
    '.env': '.env',
    'ip2region.db': './build/ip2region.db'
  }
};

if (process.platform === 'win32') seaConfig.assets['web.config'] = './web.config';

writeFileSync('./sea-config.json', JSON.stringify(seaConfig, null, 2));

execSync(`node --experimental-sea-config sea-config.json`, {
  stdio: 'inherit'
});

let runName =
  process.platform === 'win32'
    ? 'twikoo-win.exe'
    : process.platform === 'darwin'
    ? 'twikoo-macos'
    : 'twikoo-linux';

rmSync(`./${runName}`, {
  recursive: true,
  force: true
});

cpSync(process.execPath, runName);

if (process.platform === 'darwin') {
  execSync(`codesign --remove-signature ${runName}`, {
    stdio: 'inherit'
  });
}

execSync(
  `npx postject ${runName} NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 ${
    process.platform === 'darwin' ? '--macho-segment-name NODE_SEA' : ''
  }`,
  {
    stdio: 'inherit'
  }
);

if (process.platform === 'darwin') {
  execSync(`codesign --sign - ${runName}`, {
    stdio: 'inherit'
  });
}

rmSync(`./dist`, {
  recursive: true,
  force: true
});

mkdirSync('./dist');
renameSync(`./${runName}`, `./dist/${runName}`);
