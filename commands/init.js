const { prompt } = require('inquirer')
const { writeFile } = require('fs')
const { listTable } = require(`${__dirname}/../utils`)
const { resolve } = require('path')
const chalk = require('chalk')
const download = require('download-git-repo')
const ora = require('ora')

let tplList = require(`${__dirname}/../templates`)

const question = [
  {
    type: 'input',
    name: 'templateName',
    message: 'template name:',
    validate (val) {
      if (tplList[val]) {
        return true
      } else if (val === '') {
        return 'tempalte name is required!'
      } else if (!tplList[val]) {
        return 'This template doesn\'t exists.'
      }
    }
  },
  {
    type: 'input',
    name: 'projectName',
    message: 'project name:',
    validate (val) {
      if (val !== '') {
        return true
      }
      return 'Project name is required!'
    }
  },
  {
    type: 'input',
    name: 'path',
    message: 'Where to init the project:',
    default: './'
  }
]

module.exports = prompt(question).then(({ templateName, projectName, path }) => {
  console.log('name ', templateName, projectName, path)
  const gitPlace = tplList[templateName]['organization/name']
  const gitBranch = tplList[templateName]['branch']
  const spinner = ora('Downloading...')
  console.log('name ', `${gitPlace}#${gitBranch}`)
  spinner.start()

  download(`${gitPlace}#${gitBranch}`, `${path}/${projectName}`, (err) => {
    if (err) {
      console.log(chalk.red(err))
      process.exit()
    }
    spinner.stop()
    console.log(chalk.green('Project init successfully!'))
  })
})
