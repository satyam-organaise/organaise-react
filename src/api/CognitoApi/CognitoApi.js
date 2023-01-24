import { Auth } from "@aws-amplify/auth";
import { Credentials } from "@aws-amplify/core";
import appConfig from "../../Config";
const AWS = require("aws-sdk");

export const getAwsCredentialsFromCognito = async () => {
  AWS.config.region = appConfig.region;
  const creds = await Credentials.get();
  AWS.config.credentials = new AWS.Credentials(
    creds.accessKeyId,
    creds.secretAccessKey,
    creds.sessionToken
  );
  AWS.config.credentials.needsRefresh = function () {
    return Date.now() > creds.expiration;
  };

  AWS.config.credentials.refresh = function (cb) {
    console.log("Refresh Cognito IAM Creds");
    Auth.currentUserCredentials().then((creUserCred) => {
      getAwsCredentialsFromCognito().then((getAwsCred) => {
        cb();
      });
    });
  };
  return creds;
};

/////user sign up
export const CognitoSignUp = async ({ username, email, password }) => {
  try {
    const response = await Auth.signUp({
      username: username,
      password: password,
      attributes: {
        email: email,
        profile: "none",
      },
    });
    return { data: response, status: true };
  } catch (error) {
    return { error: error, status: false };
  }
};

/////// Sign up otp verifiction api call
export const SignUpOtpVarify = async ({ username, userOtp }) => {
  try {
    const response = await Auth.confirmSignUp(username, userOtp);
    return { data: response, status: true };
  } catch (error) {
    return { error: error, status: false };
  }
};
