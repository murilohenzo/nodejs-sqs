const AWS = require("aws-sdk");

const sts = new AWS.STS({
  secretAccessKey: process.env.AWS_USER_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_USER_KEY,
  region: process.env.AWS_REGION_SQS,
});

const getCrossAccountCredentials = async () => {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().getTime();
    const params = {
      RoleArn: process.env.AWS_ARN_POLICY,
      RoleSessionName: `be-descriptibe-here-${timestamp}`,
      DurationSeconds: 900,
    };
    sts.assumeRole(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          accessKeyId: data.Credentials.AccessKeyId,
          secretAccessKey: data.Credentials.SecretAccessKey,
          sessionToken: data.Credentials.SessionToken,
        });
      }
    });
  });
};

module.exports = { getCrossAccountCredentials };
