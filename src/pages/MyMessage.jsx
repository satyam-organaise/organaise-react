import React, { useState } from 'react'
import LeftSideBar from '../components/LeftSideBar/LeftSideBar'
import NewMessageGrid from '../components/NewMessageGrid/NewMessageGrid'
import { Button, Box, Grid, Typography } from '@mui/material/';
import createChannelPng from "../assets/BackgroundImages/create-channel-homepage.png";
import ContentModels from './ContentModels';

const MyMessage = () => {

    ////////// active messaging part
    const [messagingActive, setMessagingActive] = useState(false);
    ///////// Selected Channel state declare
    const [selectedChannel, setSelectedChannel] = useState({});
    const styleCss = {
        fileUploadMainBox: {
            minHeight: "500px", backgroundColor: "transparent",
        }
    }



    //////  when click on the add channel button
    //////new model  open when click on the left side bar options and some others options like add folder and add teammate and so more
    const [openNewModel, setOpenNewModel] = useState(false);
    const [show, setShow] = useState(false);
    const [NewModelOpen, setNewModelOpen] = useState(false);
    const [activeModel, setActiveModel] = useState("")

    ///// Model Open function like create channel
    const modelOpens = () => {
        setOpenNewModel(true);/////this change the state in this page and then model show
        setShow(true);/////active model in diffrent page
        setActiveModel("AddChannel");/////// which type of model active
        setNewModelOpen(true);////// Real dilog box open
    }


    return (
        <>
            <LeftSideBar
                data={{
                    pageName: "Message",
                    index: 1,
                    setMessagingActive: setMessagingActive,
                    setSelectedChannel: setSelectedChannel
                }}
            >

                {!messagingActive &&
                    <Box sx={styleCss.fileUploadMainBox}>
                        <Grid container>
                            <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                                <img src={createChannelPng} style={{ width: "350px", userSelect: "none", pointerEvents: "none" }} alt="file-upload-image" />
                            </Grid>
                            <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                                <Typography variant="subtitle1" fontWeight={"500"} >No channel added yet or select your favorite channel.</Typography>
                            </Grid>
                            <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                                <Typography sx={{ width: { sm: "75%", md: "45%" } }}
                                    color="#808191" variant="body2"
                                    textAlign={'center'} textTransform={'capitalize'}>
                                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                                </Typography>
                            </Grid>
                            <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                                <Button
                                    variant="contained"
                                    size='small'
                                    sx={{ padding: "5px 25px" }}
                                    onClick={() => modelOpens()}
                                >
                                    Create Channel
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                }

                {/*Messaging Part here*/}
                {messagingActive && <NewMessageGrid selectedChannel={selectedChannel} />}

                {openNewModel &&
                    <ContentModels
                        activeModel={activeModel} //////  which type of model
                        show={show} //// boolen value of avtive  state model
                        NewModelOpen={NewModelOpen} ///// boolean value of dialog box open
                        setOpenNewModel={setOpenNewModel}
                        setShow={setShow}
                        setActiveModel={setActiveModel}
                        setNewModelOpen={setNewModelOpen}
                    />
                }
            </LeftSideBar>
        </>
    )
}

export default MyMessage