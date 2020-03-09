const path = require('path')
const fs = require('fs')

const inquirer = require('inquirer')

module.exports = async function (program) {
        
    const prompts = []
    const deployConfig = {}

    const projectPath = process.cwd()
    const packageJsonPath = path.join(projectPath, 'package.json');

    const hasPackage = fs.existsSync(packageJsonPath);

    prompts.push({
        type: 'confirm', // 表示提问的类型，下文会单独解释
        name: 'usePackageJson', // 在最后获取到的answers回答对象中，作为当前这个问题的键
        message: '检测到存在package.json文件，使用使用package.json文件重的配置', // 打印出来的问题标题，如果为函数的话
        default: true, // 用户不输入回答时，问题的默认值。或者使用函数来return一个默认值。假如为函数时，函数第一个参数为当前问题的输入答案。
        when: hasPackage, // 接受当前用户输入的answers对象，并且通过返回true或者false来决定是否当前的问题应该去问。也可以是简单类型的值。
    }, {
        type: 'list', // 表示提问的类型，下文会单独解释
        name: 'provider', // 在最后获取到的answers回答对象中，作为当前这个问题的键
        message: '请选择OSS服务商', // 打印出来的问题标题，如果为函数的话
        default: 'Ali-OSS', // 用户不输入回答时，问题的默认值。或者使用函数来return一个默认值。假如为函数时，函数第一个参数为当前问题的输入答案。
        choices: ['Ali-OSS'], // 接受当前用户输入的answers对象，并且通过返回true或者false来决定是否当前的问题应该去问。也可以是简单类型的值。
    })

    const answers = await inquirer.prompt(prompts);

    console.log(answers);

}
