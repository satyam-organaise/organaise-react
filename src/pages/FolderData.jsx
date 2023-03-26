import React, { useState, useEffect } from 'react'
import LeftSideBar from '../components/LeftSideBar/LeftSideBar'
import { Button, Box, Grid, Typography, InputAdornment, IconButton, Menu, MenuItem } from '@mui/material/';
import fileUploadImage from "../assets/BackgroundImages/folder-data.png";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderIcon from '@mui/icons-material/Folder';
import TextField from '@mui/material/TextField'
import { AccountCircle } from '@mui/icons-material';
import { Search } from '@mui/icons-material';
import ContentModels from './ContentModels';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useDebounce } from 'use-debounce';


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

    ////delete folder and aadd file in the folder
    /////// selected Folder Data
    const [folderSelect, setFolderSelect] = useState({});
    const ActionDelFolAndAddFile = (typeService = "", d = {}) => {
        if (typeService === "addFile") {
            setFolderSelect(d);
            modelOpens("AddFileModel");
        }
        if (typeService === "deleteFolder") {
            deleteFolder(d._id);
        }
        if (typeService === "ShowFilesInFolderModel") {
            setFolderSelect(d);
            modelOpens("ShowFilesInFolderModel");
        }
    };

    /////////deletaing folder
    //////// Delete Folder
    const deleteFolder = async (folderData) => {
        const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
        const confarmDelete = window.confirm("Are you sure do u want to delete this folder.");
        if (confarmDelete) {
            const response = await axios.delete('https://devorganaise.com/api/deleteFolder',
                { data: { folderId: folderData, userId: UserId } }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                const folderResponse = response.data;
                if (folderResponse.status) {
                    toast.success(folderResponse.message);
                    await getFoldersData(UserId);
                } else {
                    toast.error(folderResponse.message);
                }
            } else {
                toast.error("Something is wrong");
            }
        }
    }



    ////Code for model open
    const [openNewModel, setOpenNewModel] = useState(false);
    const [show, setShow] = useState(false);
    const [NewModelOpen, setNewModelOpen] = useState(false);
    const [activeModel, setActiveModel] = useState("")
    ///// Model Open function like create channel
    const modelOpens = (modenOpenType) => {
        setOpenNewModel(true);/////this change the state in this page and then model show
        setShow(true);/////active model in diffrent page
        setActiveModel(modenOpenType);/////// which type of model active
        setNewModelOpen(true);////// Real dilog box open
    }

    /////////////// get the folder data here  /////
    const [folderDataStore, setFoldersData] = useState([]);
    const getFoldersData = async (userId) => {
        const userID = { userId: userId }
        try {
            const response = await axios.post('https://devorganaise.com/api/getFolders', userID, {
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

    const getFolderDataFun = () => {
        const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
        if (UserId) {
            getFoldersData(UserId);
        }
    }


    ///////// Search Folder code  Here
    const [srcFolderText, SetSrcFolderText] = useState("");
    const [debouncedSearchTerm] = useDebounce(srcFolderText, 500);
    useEffect(() => {
        if (debouncedSearchTerm !== "") {
            const searchingFiles = folderDataStore.filter((srcFolders) => srcFolders.folderName.toLowerCase().startsWith(debouncedSearchTerm.toLowerCase()));
            setFoldersData(searchingFiles);
        } else {
            getFolderDataFun();
        }

    }, [debouncedSearchTerm])


    //////////// calculate the folder size
    const folderSize = (data) => {
        if (data.length !== 0) {
            const folderFileSize = data.reduce((accumulator, currentValue) => {
                return accumulator + parseInt(currentValue.fileSize);
            }, 0);
            return `${Math.abs(parseInt(folderFileSize) / 1000000) % 1 !== 0 ?
                Math.abs(parseInt(folderFileSize) / 1000000).toFixed(2) :
                Math.floor(Math.abs(parseInt(folderFileSize) / 1000000))} MB`;

        } else {
            return 0;
        }
    }

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
                                    onClick={() => modelOpens("CreateFolder")}
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
                                                    paddingBottom: "7px", fontSize: "14px",
                                                },
                                                paddingLeft: "4px", "& fieldset": { borderRadius: "8px" }
                                            }}
                                            value={srcFolderText}
                                            onChange={(e) => SetSrcFolderText(e.target.value)}
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
                                            onClick={() => modelOpens("CreateFolder")}
                                        >
                                            Create Folder
                                        </Button>
                                    </Box>

                                </Box>
                            </Grid>
                            <Grid container item mt={3} xs={12} display={'flex'} >
                                {folderDataStore.map((d, index) =>
                                    <Box
                                        marginRight={"25px"}
                                        my={"10px"}
                                        sx={{
                                            width: "170px",
                                            height: "170px",
                                            padding: "5px 5px",
                                            boxSizing: "border-box",
                                            border: "0.5px solid #CBCBCB", borderRadius: "8px"
                                        }}
                                        key={`folder_${index}_ids`}
                                    >
                                        <Box container display={'flex'} justifyContent="end"
                                        >
                                            {/* <MoreVertIcon
                                                sx={{ fontSize: "18px", color: '#7A7A7A', cursor: "pointer",position: "relative" }}
                                            />
                                             */}

                                            <DeleteForeverIcon
                                                sx={{
                                                    fontSize: "19px",
                                                    cursor: "pointer",
                                                    marginRight: "5px",
                                                    color: "#e70f0fc2"
                                                }}
                                                onClick={() => ActionDelFolAndAddFile("deleteFolder", d)}
                                            />
                                            <NoteAddIcon
                                                sx={{
                                                    fontSize: "18px",
                                                    cursor: "pointer",
                                                    marginRight: "0px",
                                                    color: "#0d4503bf"
                                                }}
                                                onClick={() => ActionDelFolAndAddFile("addFile", d)}
                                            />

                                        </Box>
                                        <Box container display={'flex'} justifyContent="center">
                                            <FolderIcon
                                                sx={{
                                                    fontSize: '80px',
                                                    color: "#f8d755"
                                                    //selectRandomColor()
                                                    ,
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => ActionDelFolAndAddFile("ShowFilesInFolderModel", d)}
                                            />
                                        </Box>
                                        <Box container>
                                            <Typography align='center' variant="subtitle2" color={"#121212"}>{d.folderName}</Typography>
                                        </Box>
                                        <Box container>
                                            <Typography align='center' variant="subtitle2" fontSize={"13px"} color={"#CDCDCD"}>{folderSize(d.filesList)}</Typography>
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
                    folderSelect={folderSelect}////which folder silect that value store

                />
            }
        </>
    )
}

export default FolderData