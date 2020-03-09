const fetch = require('node-fetch');
const AliOSS = require('ali-oss');

module.exports = {

    getBuckets: async function (server) {

        const client = new AliOSS({
            accessKeyId: server.authentication.accessKeyId, // access secret you create
            accessKeySecret: server.authentication.accessKeySecret, // access secret you create
        });

        const result = await client.listBuckets();

        const buckets = result.buckets;

        return buckets;
    },

    getBucket: async function (server) {

        const buckets = await this.getBuckets(server);

        return buckets.find(bucket => server.bucket.name === bucket.name && server.bucket.region === bucket.region);
    },

    addBucket: async function (server) {

        const client = new AliOSS({
            accessKeyId: server.authentication.accessKeyId, // access secret you create
            accessKeySecret: server.authentication.accessKeySecret, // access secret you create
            region: server.bucket.region
        });

        const result = await client.putBucket(server.bucket.name)

        if (result.res.status === 200) {

            return await this.getBucket(server);
        } else {

            throw new Error('bucket 创建失败')
        }
    },


    updateBucketAcl: async function (server, acl) {

        const client = new AliOSS({
            accessKeyId: server.authentication.accessKeyId, // access secret you create
            accessKeySecret: server.authentication.accessKeySecret, // access secret you create
            region: server.bucket.region
        });

        await client.putBucketACL(server.bucket.name, acl);
    },

    updateBucketWebsite: async function (server, index) {

        const client = new AliOSS({
            accessKeyId: server.authentication.accessKeyId, // access secret you create
            accessKeySecret: server.authentication.accessKeySecret, // access secret you create
            region: server.bucket.region
        });

        await client.putBucketWebsite(server.bucket.name, {
            index: index
        });
    },

    addFile: async function (server, key, file) {

        const client = new AliOSS({
            accessKeyId: server.authentication.accessKeyId,
            accessKeySecret: server.authentication.accessKeySecret,
            region: server.bucket.region,
            bucket: server.bucket.name
        });

        let result = await client.put(key, file);


        console.log(result.url);
    }
}
