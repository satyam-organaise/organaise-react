import { Box, Grid, Typography, Avatar, Stack, Button, TextField } from '@mui/material'
import React from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';

const NewMessageGrid = () => {

    const cssStyle = {
        firstBoxMessage: { height: "80vh", backgroundColor: "#ffffff", marginTop: "0px"},
        groupNameBox: { position: "sticky", top: "65px", width: "100%", height: "50px",zIndex:"100" , 
        borderBottom: "1px solid #efefef", background: " #FFFFFF", boxSizing: "border-box", borderBottom: "1px solid #F1F1F1" },
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

    return (
        <>
            <Box container py="13px" px={"25px"} boxSizing={"border-box"} sx={cssStyle.groupNameBox} display="flex" justifyContent={"space-between"}>
                <Box display={"flex"}>
                    <Typography fontWeight={"600"} variant="subtitle2">#general</Typography>
                    <Stack ml={1} direction="row" spacing={-.25}>
                        <Avatar sx={cssStyle.avatarCss} alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
                        <Avatar sx={cssStyle.avatarCss} alt="Travis Howard" src="https://mui.com/static/images/avatar/2.jpg" />
                        <Avatar sx={cssStyle.avatarCss} alt="Cindy Baker" src="https://mui.com/static/images/avatar/3.jpg" />
                    </Stack>
                </Box>
                <Box>
                    <Button sx={{ ...cssStyle.listofPeopeBtn, marginRight: "10px" }} variant="outlined" size="small">
                        Add Member
                    </Button>
                    <Button sx={cssStyle.listofPeopeBtn} variant="contained" size="small">
                        List Of People
                    </Button>
                </Box>
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

        </>

    )
}

export default NewMessageGrid