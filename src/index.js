const { program } = require('commander')
const { version } = require('../package.json')
const path = require('path')

program.version(version)

const mapActions = {
  init: {
    alias: 'i',
    desc: 'create/init a project!',
    examples: [
      'qiyu init <projectName>',
      'qiyu i <projectName>'
    ]
  },
  remove: {
    alias: 'rm',
    desc: 'remove files from path',
    examples: [
      'qiyu rm -r <filepath>',
      'qiyu rm <file>'
    ]
  },
  '*': {
    alias: '',
    desc: 'command not found!',
    examples: []
  }
}

Object.keys(mapActions).forEach(key => {
  program
    .command(key)
    .alias(mapActions[key].alias)
    .description(mapActions[key].desc)
    .action(() => {
      if (key === '*') {
        console.log(mapActions[key].desc);
      } else {
        require(path.resolve(__dirname, `./actions/${key}`))(
          ...process.argv.splice(3)
        )
      }
    })
})

program.parse(process.argv)