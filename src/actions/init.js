const path = require('path')
const fs = require('fs')
const Inquirer = require('inquirer')
const chalk = require('chalk')
const del = require('del')
const axios = require('axios')
const { promisify } = require('util')
const downloadGitRepo = promisify(require('download-git-repo'))
const ncp = promisify(require('ncp'))
const shelljs = require('shelljs')
const ora = require('ora')

const baseUrl = 'https://api.github.com'
const existDir = async (projectName) => {
  const dir = path.resolve('.')
  const createDir = dir + '/' + projectName
  if (fs.existsSync(createDir)) {
    const result = await Inquirer.prompt({
      name: 'create dir',
      type: 'confirm',
      message: chalk.green('文件夹已存在，是否覆盖?'),
      default: true
    })
    if (result) {
      await del(createDir, {force: true})
      fs.mkdirSync(createDir)
      return createDir
    } else {
      console.log('取消了创建目录，停止创建项目！')
      process.exit(1)
    }
  }
  fs.mkdirSync(createDir)
  return createDir
}

const fetchRepoList = async () => {
  const {data} = await axios.get(baseUrl + '/users/qiyu99/repos')
  const repoNames = data
    .map(item => item.name)
    .filter(item => /template/.test(item))
  return repoNames
}

const fetchRepoTags = async (repo) => {
  const {data} = await axios.get(baseUrl + `/repos/qiyu99/${repo}/tags`)
  const tagName = data.map(item => item.name)
  return tagName
}

const waitLoading = async (fn, message) => (...args) => {
  const spinner = ora(message)
  spinner.start()
  const result = await fn(...args)
  spinner.succeed()
  return result
}

module.exports = async (projectName) => {
  // TODO：
  // 1. 创建项目目录， 如果目录存在，则提示用户是否覆盖
  const dest = await existDir(projectName)
  console.log('dest', dest);
  // 2. 拉取GitHub template， 选择指定tag与仓库
  const repos = await waitLoading(fetchRepoList, '获取远程仓库列表！')()
  const {repo} = await Inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: chalk.green('选择你需要下载的仓库？'),
    choices: repos,
  })

  // const tags = await waitLoading(fetchRepoTags, '获取远程仓库标签！')(repo)
  // const {tag} = await Inquirer.prompt({
  //   name: 'tag',
  //   type: 'list',
  //   message: '选择你要下载的版本标签!',
  //   choices: tags
  // })
  // 3. 下载并安装依赖
  let repoUrl = `qiyu99/${repo}`
  // if (tag) {
  //   repoUrl = `qiyu99/${repo}/#${tag}`
  // }
  await waitLoading(downloadGitRepo, '远程仓库下载中...')(repoUrl, dest + '/tmp')
  // 拷贝tmp目录下所有文件到dest目录下
  // ncp 专门用来拷贝项目
  await ncp(dest + '/tmp', dest)
  await del(dest + '/tmp')

  shelljs.cd(dest)
  shelljs.exec('npm install')
}