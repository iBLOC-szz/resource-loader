const path = require('path')
const fs = require('fs')

const AliOssService = require('../ali-oss');

const PUBLIC_READ_ACL = 'public-read';
let targetPath = '';

function addFiles(server, folderPath) {

    const fileNames = fs.readdirSync(folderPath);

    fileNames.forEach(fileName => {

        const filePath = path.join(folderPath, fileName);

        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {

            addFiles(server, filePath);
        } else {

            const relativePath = path.relative(targetPath, filePath);

            const key = relativePath.split(path.sep).join('/');

            AliOssService.addFile(server, key, filePath)
        }
    })
}

module.exports = async function (deployConfig) {

    const projectPath = process.cwd()

    targetPath = path.join(projectPath, deployConfig.target)

    let bucket = await AliOssService.getBucket(deployConfig.server);

    if (!bucket) {
        bucket = await AliOssService.addBucket(deployConfig.server);
    }

    await AliOssService.updateBucketAcl(deployConfig.server, PUBLIC_READ_ACL);
    await AliOssService.updateBucketWebsite(deployConfig.server, deployConfig.index);

    addFiles(deployConfig.server, targetPath);
}
