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


////////// Add members in a channel ////
async function createChannelMembership(
    channelArn,
    memberArn,
    userId,
    subChannelId
  ) {
    const chimeBearerArn = createMemberArn(userId);
    const params = {
      ChannelArn: channelArn,
      MemberArn: memberArn,
      Type: "DEFAULT", // OPTIONS ARE: DEFAULT and HIDDEN
      ChimeBearer: chimeBearerArn,
      SubChannelId: subChannelId,
    };
  
    const request = (await chimeMessagingClient()).createChannelMembership(
      params
    );
    const response = await request.promise();
    return response.Member;
  }


  ///////////////////// send message
  async function sendChannelMessage(
    channelArn,
    messageContent,
    persistence,
    type,
    member,
    subChannelId,
    options = null
) {
   
    
    const chimeBearerArn = createMemberArn(member.userId);
    const params = {
        ChimeBearer: chimeBearerArn,
        ChannelArn: channelArn,
        Content: messageContent,
        Persistence: persistence, // Allowed types are PERSISTENT and NON_PERSISTENT
        Type: type, // Allowed types are STANDARD and CONTROL
        SubChannelId: subChannelId,
    };
    if (options && options.Metadata) {
        params.Metadata = options.Metadata;
    }

    const request = (await chimeMessagingClient()).sendChannelMessage(params);
    const response = await request.promise();
    const sentMessage = {
        response: response,
        CreatedTimestamp: new Date(),
        Sender: { Arn: createMemberArn(member.userId), Name: member.username },
    };
    return sentMessage;
}


////////////////////// list of channel messages
async function listChannelMessages(
    channelArn,
    userId,
    subChannelId,
    nextToken = null
  ) {
    const chimeBearerArn = createMemberArn(userId);
  
    const params = {
      ChannelArn: channelArn,
      NextToken: nextToken,
      ChimeBearer: chimeBearerArn,
      SubChannelId: subChannelId,
    };
  
    const request = (await chimeMessagingClient()).listChannelMessages(params);
    const response = await request.promise();
    const messageList = response.ChannelMessages;
    messageList.sort(function (a, b) {
      // eslint-disable-next-line no-nested-ternary
      return a.CreatedTimestamp < b.CreatedTimestamp
        ? -1
        : a.CreatedTimestamp > b.CreatedTimestamp
        ? 1
        : 0;
    });
  
    const messages = [];
    for (let i = 0; i < messageList.length; i++) {
      const message = messageList[i];
      messages.push(message);
    }
    return { Messages: messages, NextToken: response.NextToken };
  }


export { createChannel, describeChannel, 
    listChannelMembershipsForAppInstanceUser, 
    getAwsCredentialsFromCognito,createChannelMembership ,
    sendChannelMessage ,listChannelMessages };