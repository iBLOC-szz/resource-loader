#!/usr/bin/env node

'use strict'

const path = require('path')
const fs = require('fs')

const commander = require('commander');

const application = require('./package.json');

const init = require('./command/init');
const deploy = require('./command/deploy');

const DEPLOY_CONFIG_FILE_NAME = 'spa-deploy.json'

const program = new commander.Command();

program
    .version(application.version, '-v --version')
    .description(`SPA-Deploy ${application.version}`)
    .usage('<command>');

program
    .command('init')
    .alias('a')
    .description('init deploy config')
    .action(init);

program
    .command('deploy')
    .alias('d')
    .description('Deploy your SPA project to OSS')
    .action(() => {

        const projectPath = process.cwd()
        const deployConfigPath = path.join(projectPath, DEPLOY_CONFIG_FILE_NAME);

        if (fs.existsSync(deployConfigPath)) {

            const deployConfig = require(deployConfigPath);
            deploy(deployConfig);
        } else {
            init();
        }
    })

program.parse(process.argv);

if (program.rawArgs.length < 3 && !program.args.length) {
    program.help()
}

