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

/////// Sign in the user and get the token
//////get the access token by this function
//////if user id not set then user id set here
const updateUserAttributes = async (userId) => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.updateUserAttributes(user, {
      profile: userId,
    }).then((checkD) => {
      console.log("updateUserAttributes", checkD);
    })
  } catch (err) {
    console.log(err);
  }
};


const setAuthenticatedUserFromCognito = () => {
  ///// Its return the current userInfo
  Auth.currentUserInfo()
    .then(curUser => {
      const setMember = { username: curUser.username, userId: curUser.id };
      if (curUser.attributes?.profile === 'none') {
        updateUserAttributes(curUser.id);
        return { data: setMember, authenticate: false, status: false };
      } else {
        return { data: setMember, authenticate: true, status: true };
      }
    })
    .catch((err) => {
      return { error: `Failed to set authenticated user! ${err}`, status: false }
    });
  getAwsCredentialsFromCognito();
};

export const userSignIn = async ({ username, password }) => {
  try {
   const signInData  =  await Auth.signIn({ username, password })
      .then((d) => {
        return {data:d,status:true}
        // setAuthenticatedUserFromCognito() ///// this function use as a callback
      }
      ).catch((error)=>{
        return {data:[],status:false ,error:error}
      })
      return signInData;
  }
  catch (err) {
    return { error: err, status: false }
  }
};

/////////// Resend the otp for varify the email
export const resendConfermationEMail = async ({ username }) => {
  try {
    const responseData = await Auth.resendSignUp(username)
      .then((data) => {
        console.log({ status: true, data: data });
        return { status: true, data: data };
      })
      .catch((err) => { return { status: false, data: [], error: err } });
    return responseData;
  } catch (error) {
    return { error: error, status: false }
  }
}


