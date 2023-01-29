import appConfig from "../../Config";
import { Auth } from "@aws-amplify/auth";
import { Credentials } from "@aws-amplify/core";
const ChimeIdentity = require("aws-sdk/clients/chimesdkidentity");
const ChimeMessaging = require("aws-sdk/clients/chimesdkmessaging");
const AWS = require("aws-sdk");

////////// Crete member ARN
export const createMemberArn = (userId) =>
    `${appConfig.appInstanceArn}/user/${userId}`;

export const Persistence = {
    PERSISTENT: "PERSISTENT",
    NON_PERSISTENT: "NON_PERSISTENT",
};

export const MessageType = {
    STANDARD: "STANDARD",
    CONTROL: "CONTROL",
};



const appInstanceUserArnHeader = "x-amz-chime-bearer";

let chimeMessaging = null;
let chimeIdentity = null;

///////// Setup the credetials
 const getAwsCredentialsFromCognito = async () => {
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



// Setup Chime Messaging Client lazily
async function chimeMessagingClient(region = "") {
    if (chimeMessaging == null) {
        chimeMessaging = new ChimeMessaging();
    }
    return chimeMessaging;
}

///////create channel function////////
async function createChannel(
    appInstanceArn,
    metadata,
    name,
    mode,
    privacy,
    elasticChannelConfiguration,
    userId
) {
    const chimeBearerArn = createMemberArn(userId);
    if (!metadata && privacy === "PUBLIC") {
        const channelType = elasticChannelConfiguration
            ? "PUBLIC_ELASTIC"
            : "PUBLIC_STANDARD";
        metadata = JSON.stringify({ ChannelType: channelType });
    }

    const params = {
        AppInstanceArn: appInstanceArn,
        Metadata: metadata,
        Name: name,
        Mode: mode,
        Privacy: privacy,
        ChimeBearer: chimeBearerArn,
    };

    let regionDefiend = appInstanceArn.split(":")[3];
    if (elasticChannelConfiguration) {
        params["ElasticChannelConfiguration"] = elasticChannelConfiguration;
    }
    const request = (await chimeMessagingClient(regionDefiend)).createChannel(
        params
    );
    request.on("build", function () {
        request.httpRequest.headers[appInstanceUserArnHeader] =
            createMemberArn(userId);
    });
    const response = await request.promise();
    console.log("response", response);
    return response.ChannelArn;
}

///////// After creaating the channel we aare describe the channel
async function describeChannel(channelArn, userId) {
    const chimeBearerArn = createMemberArn(userId);
    const params = {
        ChannelArn: channelArn,
        ChimeBearer: chimeBearerArn,
    };

    const request = (await chimeMessagingClient()).describeChannel(params);
    const response = await request.promise();
    return response.Channel;
}


async function listChannelMembershipsForAppInstanceUser(userId) {
    const chimeBearerArn = createMemberArn(userId);
    const params = {
        ChimeBearer: chimeBearerArn,
    };
    const request = (
        await chimeMessagingClient()
    ).listChannelMembershipsForAppInstanceUser(params);
    const response = await request.promise();
    const channels = response.ChannelMemberships;
    return channels;
}


export { createChannel, describeChannel ,listChannelMembershipsForAppInstanceUser ,getAwsCredentialsFromCognito};