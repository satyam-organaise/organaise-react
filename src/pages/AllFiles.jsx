import React, { useState, useEffect } from 'react'
import LeftSideBar from '../components/LeftSideBar/LeftSideBar'
import { Button, Box, Grid, Typography, InputAdornment, IconButton } from '@mui/material/';
import fileUploadImage from "../assets/BackgroundImages/folder-data.png";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderIcon from '@mui/icons-material/Folder';
import TextField from '@mui/material/TextField'
import { AccountCircle } from '@mui/icons-material';
import { Search } from '@mui/icons-material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AllFiles = () => {
    const navigate = useNavigate();

    const [userFiles, setUserFiles] = useState([]);

    const colorsCode = ["#FBCFFF", "#FFCFCF", "#CFFFDD", "#CFEEFF", "#FFE9CF", "#CFE8FF", "#FFF2CF", "#FFCEE0", "#FFD5CF", "#DECFFF"]
    const selectRandomColor = () => {
        return colorsCode[Math.floor(Math.random() * 10)];
    }
    const style = {
        folderCreateMainBox: {
            minHeight: "500px", backgroundColor: "transparent",
        }
    }

    /////// Get files of this user
    const getFilesOfUser = async (userId) => {
        const userID = { userId: userId }
        const response = await axios.post('https://devorganaise.com/api/getfiles', userID, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const FilesResponse = response.data;
        if (FilesResponse.status) {
            const FilesData = FilesResponse.data;
            setUserFiles(FilesData)
        } else {
            toast.error(FilesResponse.message);
        }

    }

    useEffect(() => {
        const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
        if (UserId) {
            getFilesOfUser(UserId);
        }
    }, [])

    return (
        <LeftSideBar data={{ pageName: "data", index: 2 }}>
            <Box px={"20px"} sx={style.folderCreateMainBox}>
                {userFiles.length === 0 &&
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
                                onClick={() => navigate("/upload")}
                            >
                                Add File
                            </Button>
                        </Grid>
                    </Grid>
                }

                {userFiles.length !== 0 &&
                    <Grid container px={1} >
                        <Grid container item mt={2} xs={12} >
                            <Box container width={"100%"} display={'flex'} justifyContent="space-between">
                                <Typography variant="h6" >All Files</Typography>
                                <Box >
                                    <TextField
                                        id="search_folder"
                                        placeholder='Search file'
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
                                        onClick={() => navigate("/upload")}
                                    >
                                        Add File
                                    </Button>
                                </Box>

                            </Box>
                        </Grid>
                        <Grid container item mt={3} xs={12} display={'flex'} >
                            {userFiles.length !== 0 && userFiles.map((d) =>
                                <Box marginRight={"25px"} my={"10px"} sx={{
                                    width: "170px",
                                    height: "170px",
                                    padding: "5px 5px",
                                    boxSizing: "border-box",
                                    border: "0.5px solid #CBCBCB", borderRadius: "8px"
                                }}>
                                    <Box container display={'flex'} justifyContent="end"><MoreVertIcon sx={{ fontSize: "18px", color: '#7A7A7A' }} /></Box>
                                    <Box container display={'flex'} justifyContent="center">
                                        <TextSnippetIcon sx={{ fontSize: '80px', color: selectRandomColor() }} />
                                    </Box>
                                    <Box container>
                                        <Typography align='center' variant="subtitle2" color={"#121212"}>
                                            {d.fileName.split(".")[0].length > 15 ? d.fileName.split(".")[0].substring(0, 14) : d.fileName.split(".")[0]}
                                        </Typography>
                                    </Box>
                                    <Box container>
                                        <Typography align='center' variant="subtitle2" fontSize={"13px"}
                                            color={"#CDCDCD"}>
                                            {`${Math.abs(parseInt(d.fileSize) / 1000000) % 1 !== 0 ? Math.abs(parseInt(d.fileSize) / 1000000).toFixed(2) : Math.floor(Math.abs(parseInt(d.fileSize) / 1000000))} MB`}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                }
            </Box>
        </LeftSideBar>
    )
}

export default AllFiles