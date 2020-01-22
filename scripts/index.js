
const childProcess = require('child_process')
const fs = require('fs')
const git = require('./git-latest-commit')

const args = process.argv.slice(2)
const params = args.map(item => {
  const data = `${item}`.split('=')
  return {
    key: data[0],
    value: data[1]
  }
}).reduce((all, item) => {
  return { ...all, [item.key]: item.value }
}, {})
const ENV = params.ENV || 'dev'
const DEBUG_PAGE = params.DEBUG_PAGE ? 'dev' : 'release'
// build file
buildInformation()
// REMOVE INFORMATION
childProcess.execSync('rm -rf src/configs/index.json')
// BUILD INFORMATION
childProcess.execSync(`cp ./src/templates/index.${ENV}.json ./src/configs/index.json`)
// BUILD DEBUG PAGE
childProcess.execSync('rm -rf src/pages/DebugPage.js')
childProcess.execSync(`cp scripts/pages/DebugPage.${DEBUG_PAGE}.js src/pages/DebugPage.js`)

function getLastCommitSync () {
  return new Promise((resolve, reject) => {
    git.getLastCommit(function (err, commit) {
      // read commit object properties
      if (err) resolve(err)
      resolve(commit)
    })
  })
}

async function buildInformation () {
  try {
    childProcess.execSync('rm -rf ./src/configs/build.json')
    const info = await getLastCommitSync()
    let gradle = ''
    try {
      gradle = childProcess.execSync('./android/gradlew --version').toString()
    } catch (err) {
    }
    let gitVersion = ''
    try {
      gitVersion = childProcess.execSync('git --version').toString()
    } catch (err) {
    }
    let reactNativeInfo = ''
    try {
      reactNativeInfo = childProcess.execSync('react-native info').toString()
    } catch (err) {
    }
    let gitLatestTag = ''
    try {
      gitLatestTag = childProcess.execSync('git describe --tags $(git rev-list --tags --max-count=1)').toString()
    } catch (err) {
    }
    const node = childProcess.execSync('node --version').toString()
    const buildMachine = childProcess.execSync('uname -amnprsv').toString()
    const projectFolder = childProcess.execSync('pwd').toString()
    fs.writeFileSync('./src/configs/build.json', JSON.stringify({
      gitVersion,
      gitLatestTag,
      reactNativeInfo,
      buildDate: Date.now(),
      projectFolder: projectFolder,
      buildMachine: buildMachine,
      gradle: gradle,
      nodejs: node,
      commit: info
    }, null, 2))
  } catch (err) {
    fs.writeFileSync('./src/configs/build.json', '{}')
  }
}
