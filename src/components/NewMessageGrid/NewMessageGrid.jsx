import { Box, Grid, Typography, Avatar, Stack, Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import {
    createChannel, describeChannel, listChannelMembershipsForAppInstanceUser, getAwsCredentialsFromCognito,
    sendChannelMessage, listChannelMessages
}
    from "../../api/ChimeApi/ChimeApi";

import appConfig from "../../Config";
//////////get the all users from congnito ///////////////////
import { IdentityService } from '../../services/IdentityService.js';
import ContentModels from '../../pages/ContentModels';


const NewMessageGrid = ({ selectedChannel }) => {

    //////////// Store the userid of user ////////
    const [UserId, setUserId] = useState("");
    ////////// Create and store Identity service //////
    const [IdentityServiceObject] = useState(
        () => new IdentityService(appConfig.region, appConfig.cognitoUserPoolId)
    );

    useEffect(() => {
        setActiveChannel(selectedChannel);
    }, [selectedChannel])

    //////////When this page render then user_id store , nad channel list also load
    useEffect(() => {
        getAwsCredentialsFromCognito();
        IdentityServiceObject.setupClient();
        let getLoginUserName = localStorage.getItem(`CognitoIdentityServiceProvider.${appConfig.cognitoAppClientId}.LastAuthUser`);
        let selectUserData = localStorage.getItem(`CognitoIdentityServiceProvider.${appConfig.cognitoAppClientId}.${getLoginUserName}.userData`);
        let userid = (JSON.parse(selectUserData).UserAttributes.find((d) => d.Name === "profile")).Value;
        setUserId(userid)
        //setMember({ username: getLoginUserName, userId: userid });
    }, [])

    /////////when user click on the channel/////////////
    //////// Here we are store the active channel //////
    const [ActiveChannel, setActiveChannel] = useState({});
    //////// All messges of channel  store here //////////////
    const [AllMessagesChannel, setAllMessgesOfChannel] = useState([]);
    const [messageInterval, setmessageInterval] = useState(null);

    /////////// Get the channel messaages///////
    const GetMessagesListOnEverySec = (ActiveChannel, user_id) => {
        listChannelMessages(ActiveChannel.ChannelArn, user_id, undefined, null).then((md) => {
            setAllMessgesOfChannel(md.Messages)
        }).catch((error) => {
            console.log("error", error);
        })
    }

    useEffect(() => {
        console.log("messageInterval val", messageInterval)
        if (Object.keys(ActiveChannel).length > 0) {/////Here we are check object is empty or not
            clearInterval(messageInterval);
            setAllMessgesOfChannel([]);
            setmessageInterval(setInterval(() => {
                GetMessagesListOnEverySec(ActiveChannel, UserId);
            }, [3000]))
            console.log("messageInterval", messageInterval);
        }
    }, [ActiveChannel])


    const cssStyle = {
        firstBoxMessage: { height: "80vh", backgroundColor: "#ffffff", marginTop: "0px" },
        groupNameBox: {
            position: "sticky", top: "65px", width: "100%", height: "50px", zIndex: "100",
            borderBottom: "1px solid #efefef", background: " #FFFFFF", boxSizing: "border-box", borderBottom: "1px solid #F1F1F1"
        },
        avatarCss: { width: "25px", height: "25px" },
        listofPeopeBtn: { paddingLeft: "10px", paddingRight: "10px", fontSize: "10px" },
        timeRecMess: { fontSize: "10px", lineHeight: "25px", paddingLeft: "5px" },
        recRealMess: {
            paddingRight: "30px", paddingLeft: "10px", paddingTop: "10px", paddingBottom: "10px",
            fontSize: "12px", lineHeight: "15px", background: " #ECF4FF", color: "#323232", borderRadius: "0px 10px 10px 10px"
        },
        sendRealMess: {
            paddingRight: "10px", paddingLeft: "10px", paddingTop: "10px", paddingBottom: "10px",
            fontSize: "12px", lineHeight: "15px", color: "#323232", background: " #F8F8F8", borderRadius: "10px 0px 10px 10px",
        },
        sendMessInput: {
            "& input": {
                fontSize: "13px !important"
            },
            "& fieldset": {
                borderRadius: "50px",
            }
        },
        sendMessIcon: {
            position: "absolute", right: "28px", top: "14px", fontSize: "28px", backgroundColor: "#333333", borderRadius: "25px", padding: "5px", color: "#fff", cursor: "pointer"
        },
        messageBoxCon: {
            backgroundColor: "#ffffff",
            height: "75vh", width: "100%", position: "absolute", overflowY: "auto",
            '&::-webkit-scrollbar': {
                width: '0px',
            },
            '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
            },
        }
    }

    ///// Model Open function like create channel
    //////new model  open when click on the left side bar options and some others options like add folder and add teammate and so more
    const [openNewModel, setOpenNewModel] = useState(false);
    const [show, setShow] = useState(false);
    const [NewModelOpen, setNewModelOpen] = useState(false);
    const [activeModel, setActiveModel] = useState("")
    const modelOpens = () => {
        setOpenNewModel(true);/////this change the state in this page and then model show
        setShow(true);/////active model in diffrent page
        setActiveModel("AddTeamMate");/////// which type of model active
        setNewModelOpen(true);////// Real dilog box open
    }

    return (
        <>
            <Box container py="13px" px={"25px"} boxSizing={"border-box"} sx={cssStyle.groupNameBox} display="flex" justifyContent={"space-between"}>
                {Object.keys(ActiveChannel).length > 3 && <>
                    <Box display={"flex"}>
                        <Typography fontWeight={"600"} variant="subtitle2">{ActiveChannel.Name.charAt(0).toUpperCase() + ActiveChannel.Name.slice(1)}</Typography>
                        <Stack ml={1} direction="row" spacing={-.25}>
                            <Avatar sx={cssStyle.avatarCss} alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                            <Avatar sx={cssStyle.avatarCss} alt="Travis Howard" src="https://mui.com/static/images/avatar/2.jpg" />
                            <Avatar sx={cssStyle.avatarCss} alt="Cindy Baker" src="https://mui.com/static/images/avatar/3.jpg" />
                        </Stack>
                    </Box>
                    <Box>
                        <Button
                            sx={{ ...cssStyle.listofPeopeBtn, marginRight: "10px" }}
                            variant="outlined"
                            size="small"
                            onClick={() => modelOpens()}>
                            Add Member
                        </Button>
                        <Button sx={cssStyle.listofPeopeBtn} variant="contained" size="small">
                            List Of People
                        </Button>
                    </Box>
                </>
                }
            </Box>
            <Box container position={'relative'} id="NewMessageBox" sx={cssStyle.firstBoxMessage}>
                <Box container position={'absolute'} sx={cssStyle.messageBoxCon} pt={"40px"} pb={"30px"} mt={"0px"} px={"20px"}>
                    <Grid id="rec_mess_con_grid" container spacing={5}>
                        <Grid id="reciver_mess_grid" sx={{ paddingTop: "10px !important" }} item xs={12} md={6}>
                            <Box container display={'flex'} mb={1} py={0.5}>
                                <Box id="mess_user_pic_box">
                                    <Stack ml={1} direction="row">
                                        <Avatar sx={{ ...cssStyle.avatarCss, width: "30px", height: "30px" }} alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                                    </Stack>
                                </Box>
                                <Box ml={1}>
                                    <Grid container>
                                        <Grid container item>
                                            <Typography variant="subtitle2" fontWeight={"700"} textTransform={'capitalize'}>satyam</Typography>
                                            <Typography variant="body2" sx={cssStyle.timeRecMess} >10:30 AM</Typography>
                                        </Grid>
                                        <Grid container item boxSizing={"border-box"} mr="16px" >
                                            <Typography variant="body2" sx={cssStyle.recRealMess} >It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                            <Box container display={'flex'} mb={1} py={0.5}>
                                <Box id="mess_user_pic_box">
                                    <Stack ml={1} direction="row">
                                        <Avatar sx={{ ...cssStyle.avatarCss, width: "30px", height: "30px" }} alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                                    </Stack>
                                </Box>
                                <Box ml={1}>
                                    <Grid container>
                                        <Grid container item>
                                            <Typography variant="subtitle2" fontWeight={"700"} textTransform={'capitalize'}>satyam</Typography>
                                            <Typography variant="body2" sx={cssStyle.timeRecMess} >10:30 AM</Typography>
                                        </Grid>
                                        <Grid container item boxSizing={"border-box"} mr="16px" >
                                            <Typography variant="body2" sx={cssStyle.recRealMess} >It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid id="empty_reciver_mess_grid" item display={{ xs: "none", md: "block" }} xs={12} md={6}>
                        </Grid>
                    </Grid>
                    <Grid id="send_mess_con_grid" container spacing={5}>
                        <Grid item id="empty_sender_mess_grid" display={{ xs: "none", md: "block" }} xs={12} md={6}>
                        </Grid>
                        <Grid item id="sender_mess_grid" xs={12} md={6}>
                            <Box container display={'flex'} flexDirection="row-reverse" mb={1} py={0.5}>
                                <Box id="mess_user_pic_box_send">
                                    <Stack ml={1} direction="row">
                                        <Avatar sx={{ ...cssStyle.avatarCss, width: "30px", height: "30px" }} alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                                    </Stack>
                                </Box>
                                <Box ml={1}>
                                    <Grid container>
                                        <Grid container item display={"flex"} justifyContent="flex-end">
                                            <Typography variant="subtitle2" fontWeight={"700"} textTransform={'capitalize'}>satyam</Typography>
                                            <Typography variant="body2" sx={cssStyle.timeRecMess} >10:30 AM</Typography>
                                        </Grid>
                                        <Grid container item boxSizing={"border-box"} mr="16px" >
                                            <Typography variant="body2" sx={cssStyle.sendRealMess} >It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid id="send_mess_con_grid" container spacing={5}>
                        <Grid item id="empty_sender_mess_grid" display={{ xs: "none", md: "block" }} xs={12} md={6}>
                        </Grid>
                        <Grid item id="sender_mess_grid" xs={12} md={6}>
                            <Box container display={'flex'} flexDirection="row-reverse" mb={1} py={0.5}>
                                <Box id="mess_user_pic_box_send">
                                    <Stack ml={1} direction="row">
                                        <Avatar sx={{ ...cssStyle.avatarCss, width: "30px", height: "30px" }} alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                                    </Stack>
                                </Box>
                                <Box ml={1}>
                                    <Grid container>
                                        <Grid container item display={"flex"} justifyContent="flex-end">
                                            <Typography variant="subtitle2" fontWeight={"700"} textTransform={'capitalize'}>satyam</Typography>
                                            <Typography variant="body2" sx={cssStyle.timeRecMess} >10:30 AM</Typography>
                                        </Grid>
                                        <Grid container item boxSizing={"border-box"} mr="16px" >
                                            <Typography variant="body2" sx={cssStyle.sendRealMess} >It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid id="send_mess_con_grid" container spacing={5}>
                        <Grid item id="empty_sender_mess_grid" display={{ xs: "none", md: "block" }} xs={12} md={6}>
                        </Grid>
                        <Grid item id="sender_mess_grid" xs={12} md={6}>
                            <Box container display={'flex'} flexDirection="row-reverse" mb={1} py={0.5}>
                                <Box id="mess_user_pic_box_send">
                                    <Stack ml={1} direction="row">
                                        <Avatar sx={{ ...cssStyle.avatarCss, width: "30px", height: "30px" }} alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                                    </Stack>
                                </Box>
                                <Box ml={1}>
                                    <Grid container>
                                        <Grid container item display={"flex"} justifyContent="flex-end">
                                            <Typography variant="subtitle2" fontWeight={"700"} textTransform={'capitalize'}>satyam</Typography>
                                            <Typography variant="body2" sx={cssStyle.timeRecMess} >10:30 AM</Typography>
                                        </Grid>
                                        <Grid container item boxSizing={"border-box"} mr="16px" >
                                            <Typography variant="body2" sx={cssStyle.sendRealMess} >It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Box position={'absolute'} sx={{ width: "100%", bottom: "0px", backgroundColor: "#ffffff" }} py={"10px"} container px={"25px"}>
                    <Box container
                        sx={{
                            width: '100%',
                        }}
                    >
                        <TextField size='small' sx={cssStyle.sendMessInput} fullWidth placeholder='Type a message' id="messageInput" />
                        <AttachFileIcon sx={{ ...cssStyle.sendMessIcon, right: "60px", backgroundColor: "#fff", color: "#333" }} />
                        <SendIcon sx={cssStyle.sendMessIcon} />
                    </Box>
                </Box>
            </Box>

            {openNewModel &&
                <ContentModels
                    activeModel={activeModel} //////  which type of model
                    show={show} //// boolen value of avtive  state model
                    NewModelOpen={NewModelOpen} ///// boolean value of dialog box open
                    setOpenNewModel={setOpenNewModel}
                    setShow={setShow}
                    setActiveModel={setActiveModel}
                    setNewModelOpen={setNewModelOpen}
                    ActiveChannel={ActiveChannel}
                />
            }

        </>

    )
}

export default NewMessageGrid