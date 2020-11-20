const aws = require("aws-sdk");
const fs = require("fs");

const config = require("../config.json");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("../secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports = (request, response, next) => {
    if (!request.file) {
        return response.status(400).send();
    }

    const { filename, mimetype, size, path } = request.file;

    s3.putObject({
        Bucket: "theimagery",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size,
    })
        .promise()
        .then(() => {
            request.body.url = config.s3Url + filename;
            fs.promises.unlink(path);
            next();
        })
        .catch((err) => {
            console.log(err);
            response.status(500).send();
        });
};
