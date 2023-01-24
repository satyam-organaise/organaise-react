// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import data from "./backend/serverless/appconfig.json";
const appConfigJson = Object.assign(
  {},
  ...data.map((x) => ({ [x.OutputKey]: x.OutputValue }))
);

const appConfig = {
  apiGatewayInvokeUrl: "" || appConfigJson.apiGatewayInvokeUrl,
  cognitoUserPoolId: "us-east-1_TCBy4cCrF" || appConfigJson.cognitoUserPoolId,
  cognitoAppClientId:
    "fcmah5maoo4mscfn2irfda3jv" || appConfigJson.cognitoAppClientId,
  cognitoIdentityPoolId:
    "us-east-1:628d1da3-5f5a-4c17-989b-af56a7ca641c" ||
    appConfigJson.cognitoIdentityPoolId,
  appInstanceArn:
    "arn:aws:chime:us-east-1:739552053537:app-instance/708d8ed5-92d2-4cff-9967-d9996fcc16e6" ||
    appConfigJson.appInstanceArn,
  region: "us-east-1", // Only supported region for Amazon Chime SDK Messaging as of this writing
  attachments_s3_bucket_name:
    "dev-cognito-with-chime-chatattachmentsbucket-161d6nv516or6" ||
    appConfigJson.attachmentsS3BucketName,
};
export default appConfig;
