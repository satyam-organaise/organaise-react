import React, { useState, useEffect } from 'react'
import LeftSideBar from '../components/LeftSideBar/LeftSideBar'
import { Button, Box, Grid, Typography, InputAdornment, IconButton } from '@mui/material/';
import fileUploadImage from "../assets/BackgroundImages/folder-data.png";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderIcon from '@mui/icons-material/Folder';
import TextField from '@mui/material/TextField'
import { AccountCircle } from '@mui/icons-material';
import { Search } from '@mui/icons-material';
import ContentModels from './ContentModels';
import axios from 'axios';
import { toast } from 'react-toastify';

const FolderData = () => {
    const colorsCode = ["#FBCFFF", "#FFCFCF", "#CFFFDD", "#CFEEFF", "#FFE9CF", "#CFE8FF", "#FFF2CF", "#FFCEE0", "#FFD5CF", "#DECFFF"]
    const selectRandomColor = () => {
        return colorsCode[Math.floor(Math.random() * 10)];
    }
    const style = {
        folderCreateMainBox: {
            minHeight: "500px", backgroundColor: "transparent",
        }
    }
    ////Code for model open
    const [openNewModel, setOpenNewModel] = useState(false);
    const [show, setShow] = useState(false);
    const [NewModelOpen, setNewModelOpen] = useState(false);
    const [activeModel, setActiveModel] = useState("")
    ///// Model Open function like create channel
    const modelOpens = () => {
        setOpenNewModel(true);/////this change the state in this page and then model show
        setShow(true);/////active model in diffrent page
        setActiveModel("CreateFolder");/////// which type of model active
        setNewModelOpen(true);////// Real dilog box open
    }

    /////////////// get the folder data here  /////
    const [folderDataStore, setFoldersData] = useState([]);
    const getFoldersData = async (userId) => {
        const userID = { userId: userId }
        try {
            const response = await axios.post('http://localhost:8000/api/getFolders', userID, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const folderResponse = response.data;
            if (folderResponse.status) {
                const foldersData = folderResponse.data;
                setFoldersData(foldersData)
            } else {
                toast.error(folderResponse.message);
            }
        } catch (error) {
            if (!error.response.data.status) {
                console.log(error.response.data.message);
                setFoldersData([])
            }

        }
    }

    useEffect(() => {
        const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
        if (UserId) {
            getFoldersData(UserId);
        }
    }, [])

    return (
        <>
            <LeftSideBar data={{ pageName: "data", index: 2 }}>
                <Box px={"20px"} sx={style.folderCreateMainBox}>
                    {folderDataStore.length === 0 &&
                        <Grid container>
                            <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                                <img src={fileUploadImage} style={{ width: "350px", userSelect: "none", pointerEvents: "none" }} alt="folder-creating-image" />
                            </Grid>
                            <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                                <Typography variant="subtitle1" fontWeight={"500"} >No folders added yet</Typography>
                            </Grid>
                            <Grid container item xs={12} mt={2} display="flex" justifyContent={'center'}>
                                <Typography sx={{ width: { sm: "75%", md: "45%" } }} color="#808191" variant="body2" textAlign={'center'} textTransform={'capitalize'}>
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
                                    Create Folders
                                </Button>
                            </Grid>

                        </Grid>
                    }
                    {folderDataStore.length !== 0 &&
                        <Grid container px={1} >
                            <Grid container item mt={2} xs={12} >
                                <Box container width={"100%"} display={'flex'} justifyContent="space-between">
                                    <Typography variant="h6" >Folders</Typography>
                                    <Box >
                                        <TextField
                                            id="search_folder"
                                            placeholder='Search folder'
                                            size='small'
                                            sx={{
                                                marginRight: "10px", "& input": {
                                                    paddingTop: "7px",
                                                    paddingBottom: "7px", fontSize: "14px", borderRadius: "50px"
                                                },
                                                paddingLeft: "4px", "& fieldset": { borderRadius: "8px" }
                                            }}
                                            //value={}
                                            // onChange={}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Search sx={{ color: "#efefef" }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            size='small'
                                            sx={{ padding: "5px 20px" }}
                                            onClick={() => modelOpens()}
                                        >
                                            Create Folder
                                        </Button>
                                    </Box>

                                </Box>
                            </Grid>
                            <Grid container item mt={3} xs={12} display={'flex'} >
                                {folderDataStore.map((d) =>
                                    <Box marginRight={"25px"} my={"10px"} sx={{
                                        width: "170px",
                                        height: "170px",
                                        padding: "5px 5px",
                                        boxSizing: "border-box",
                                        border: "0.5px solid #CBCBCB", borderRadius: "8px"
                                    }}>
                                        <Box container display={'flex'} justifyContent="end"><MoreVertIcon sx={{ fontSize: "18px", color: '#7A7A7A' }} /></Box>
                                        <Box container display={'flex'} justifyContent="center">
                                            <FolderIcon sx={{ fontSize: '80px', color: selectRandomColor() }} />
                                        </Box>
                                        <Box container>
                                            <Typography align='center' variant="subtitle2" color={"#121212"}>{d.folderName}</Typography>
                                        </Box>
                                        <Box container>
                                            <Typography align='center' variant="subtitle2" fontSize={"13px"} color={"#CDCDCD"}>12 MB</Typography>
                                        </Box>
                                    </Box>
                                )}

                            </Grid>
                        </Grid>
                    }
                </Box>

            </LeftSideBar>
            {openNewModel &&
                <ContentModels
                    activeModel={activeModel} //////  which type of model
                    show={show} //// boolen value of avtive  state model
                    NewModelOpen={NewModelOpen} ///// boolean value of dialog box open
                    setOpenNewModel={setOpenNewModel}
                    setShow={setShow}
                    setActiveModel={setActiveModel}
                    setNewModelOpen={setNewModelOpen}
                    getFoldersData={getFoldersData}
                />
            }
        </>
    )
}

export default FolderData