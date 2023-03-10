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
    const updateAttrApiCall =  await Auth.updateUserAttributes(user, {
      profile: userId,
    }).then((checkD) => {
      console.log("updateUserAttributes", checkD);
      return {"updateAttribueApiCall": checkD };
    })
    
    const userAttrDataGet =   await Auth.userAttributes(user).then((attrData) => {
      return  {"Attribute data": attrData}
    }).catch((attrError) => {
      console.log("Attribute error", attrError);
    })
    
    return {updateAttrApiCall ,userAttrDataGet }
  } catch (err) {
    console.log(err);
  }
};


export const setAuthenticatedUserFromCognito = async () => {
  ///// Its return the current userInfo
  const currentUserInfoUpdate  = await Auth.currentUserInfo()
    .then(curUser => {
      const setMember = { username: curUser.username, userId: curUser.id };
      if (curUser.attributes?.profile === 'none') {
        updateUserAttributes(curUser.id);
        return { data: setMember, authenticate: false, status: false ,attribute:curUser.attributes};
      } else {
        return { data: setMember, authenticate: true, status: true ,attribute:curUser.attributes};
      }
    })
    .catch((err) => {
      return { error: `Failed to set authenticated user! ${err}`, status: false }
    });
  getAwsCredentialsFromCognito();
  return currentUserInfoUpdate;
};

export const userSignIn = async ({ username, password }) => {
  try {
    const signInData = await Auth.signIn({ username, password })
      .then((d) => {
        setAuthenticatedUserFromCognito() ///// this function create the user profile if profile is not created
        localStorage.setItem("UserData",JSON.stringify(d.attributes))
        return { data: d, status: true }

      }
      ).catch((error) => {
        return { data: [], status: false, error: error }
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
        return { status: true, data: data };
      })
      .catch((err) => { return { status: false, data: [], error: err } });
    return responseData;
  } catch (error) {
    return { error: error, status: false }
  }
}


/////////// Reset Password from here //////////
export const resetPasswordFun = async ({ username, password }) => {
  try {
    //
    const responseData = await Auth.forgotPassword(username)
      .then((data) => {
        return { status: true, data: data };
      })
      .catch((err) => { return { status: false, data: [], error: err } });
    return responseData;
  } catch (error) {
    return { error: error, status: false }
  }
}

////////// otp verification with password
export const otpWithResetPassword = async ({ username, otp, password }) => {

  const responseData = await Auth.forgotPasswordSubmit(username, otp, password).then((data) => {
    return { data: data, status: true };
  }).catch((error) => {
    return { data: [], status: false, error: error }
  })
  return responseData;

}

////////// Get the list of user
const getUserAttributeByName = (user, attribute) => {
  try {
    return user.Attributes.filter((attr) => attr.Name === attribute)[0].Value;
  } catch (err) {
    //throw new Error(`Failed at getUserAttributeByName() with error: ${err}`);
    console.log(err);
  }
};

export const getAllUsersFromCognitoIdp = async (identityClient) => {
  const getAWSCred = getAwsCredentialsFromCognito();
  try {
    const responseData = await identityClient
      .getUsers()
      .then((users) => {
        const list = users.map((user) => {
          if (getUserAttributeByName(user, 'profile') !== 'none') {
            return {
              label: user.Username,
              value: user.Attributes.filter(
                (attr) => attr.Name === 'profile'
              )[0].Value,
            };
          }
          return user;
        });
        return { status: true, data: list }
      })
      .catch((err) => {
        return { status: false, data: [], error: err }
      });
    return responseData;
  } catch (error) {
    return { status: "false", error: error }
  }


}