import React, { useState } from 'react'
import LeftSideBar from '../components/LeftSideBar/LeftSideBar'
import NewMessageGrid from '../components/NewMessageGrid/NewMessageGrid'
import { Button, Box, Grid, Typography } from '@mui/material/';
import fileUploadImage from "../assets/BackgroundImages/upload-file.png";

const MyMessage = () => {

    ////////// active messaging part
    const [messagingActive, setMessagingActive] = useState(false);
    ///////// Selected Channel state declare
    const [selectedChannel ,  setSelectedChannel] = useState({});
    const styleCss = {
        fileUploadMainBox: {
            minHeight: "500px", backgroundColor: "transparent",
        }
    }



    return (
        <>
            <LeftSideBar data={{ pageName: "Message", index: 1, setMessagingActive: setMessagingActive , setSelectedChannel:setSelectedChannel}}  >

                {!messagingActive &&
                    <Box sx={styleCss.fileUploadMainBox}>
                        <Grid container>
                            <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                                <img src={fileUploadImage} style={{ width: "350px", userSelect: "none", pointerEvents: "none" }} alt="file-upload-image" />
                            </Grid>
                            <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                                <Typography variant="subtitle1" fontWeight={"500"} >No data added yet</Typography>
                            </Grid>
                            <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                                <Typography sx={{ width: { sm: "75%", md: "45%" } }} color="#808191" variant="body2" textAlign={'center'} textTransform={'capitalize'}>
                                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                                </Typography>
                            </Grid>
                            <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                                <Button variant="contained" size='small' sx={{ padding: "5px 25px" }}>
                                    Create Channel
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                }

                {messagingActive && <NewMessageGrid  selectedChannel={selectedChannel} />}
            </LeftSideBar>
        </>
    )
}

export default MyMessage