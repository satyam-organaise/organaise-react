import React, { useEffect, useState } from 'react'
import LeftSideBar from '../components/LeftSideBar/LeftSideBar'
import Typography from '@mui/material/Typography'
import { Box, Grid, Button } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

const Folder = ({ userId }) => {
    //Index prop defiend by according to this array
    //['dashboard', 'message', 'folder', 'data', 'privacy-policy', 'settings'];


    ///// Here we are store the all folder data
    const [folderDataStore, setFoldersData] = useState([]);
    const [userFiles, setUserFiles] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState();
    const [selectedFolder, setSelectFolder] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectFolder("");
    };
    const colorsFolders = ["#7B2869", "#1A0000", "#58287F", "#0A2647", "#850000", "#FF597B", "#1C315E",
        "#FF6E31", "#227C70", "#2D033B"];

    const getRandomDigit = () => {
        return colorsFolders[Math.floor(Math.random() * 10)];
    }

    //////// Delete Folder
    const deleteFolder = async (folderData) => {
        const confarmDelete = window.confirm("R u sure do u want to delte this folder.");
        if (confarmDelete) {
            const response = await axios.delete('https://devorganaise.com/api/deleteFolder', { data: { folderId: folderData._id, userId: folderData.userId } }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.statusText === "OK") {
                const folderResponse = response.data;
                if (folderResponse.status) {
                    toast.success(folderResponse.message);
                    await getFoldersData(folderData.userId);
                } else {
                    toast.error(folderResponse.message);
                }
            } else {
                toast.error("Something is wrong");
            }
        }
    }

    /////// Add file in model
    const addFileModel = async (folderId) => {
        handleClickOpen();
        setSelectFolder(folderId)
    }



    const folderGrid = (folderClr, folderObj) => {
        return <Grid py={{ xs: 2, md: 3 }} px={{ xs: 2, md: 4 }} item xs={6} sm={6} md={4} lg={3}>
            <Box py={{ xs: 3, md: 4 }}
                sx={{
                    backgroundColor: "#ffffff",
                    display: "grid", justifyItems: "center",
                    borderRadius: "8px",
                    border: `1.2px solid`, boxShadow: "0px 0px 2px 0px",
                    borderColor: folderClr,
                    position: "relative"
                }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", paddingRight: "10px", position: "absolute", top: "10px" }}>
                    <NoteAddIcon
                        sx={{ color: "#333333", cursor: "pointer" }}
                        onClick={() => addFileModel(folderObj._id)}
                    />
                    <DeleteIcon
                        sx={{ color: "#c30606", cursor: "pointer" }}
                        onClick={() => deleteFolder(folderObj)}
                    />
                </Box>
                <Box py={1} px={1.5}
                    sx={{ backgroundColor: folderClr, borderRadius: "10px" }}>
                    <FolderIcon sx={{ fontSize: '30px', color: "#ffffff" }} />
                </Box>
                <Typography variant="subtitle1" mt={1}
                    sx={{ fontSize: "12px", fontWeight: "700", color: "#333333" }} >{folderObj.folderName}</Typography>
                <Typography variant="body1"
                    sx={{ fontSize: "11px", fontWeight: "700", opacity: "0.9", color: "#333333" }}>{folderObj.filesList.length !== 0 ? `(${folderObj.filesList.length})` : "(0)"}</Typography>
            </Box>
        </Grid>
    }


    //// Create the folder
    const createFolder = async () => {
        const folderName = window.prompt("Please enter folder name.");
        if (folderName) {
            const folderData = {
                folderName: folderName,
                userId: userId
            }

            const response = await axios.post('https://devorganaise.com/api/createFolder', folderData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
               const folderResponse = response.data;
                if (folderResponse.status) {
                    toast.success(folderResponse.message);
                    getFoldersData(userId);
                } else {
                    toast.error(folderResponse.message);
                }
            
        }
    }

    /////////////// get the folder data here  /////
    const getFoldersData = async (userId) => {
        const userID = { userId: userId }
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


    ////// Add file in folder
    const addFileInFolder = async (fileId) => {
        const addFileInFolderObject = { userId: userId, folderId: selectedFolder, fileId: fileId }
        const response = await axios.post('https://devorganaise.com/api/addFileInFolder', addFileInFolderObject, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

           const AddFilesResponse = response.data;
            if (AddFilesResponse.status) {
                toast.success(AddFilesResponse.message);
                getFoldersData(userId);
                handleClose();
            } else {
                toast.error(AddFilesResponse.message);
            }
        
    }


    useEffect(() => {
        getFoldersData(userId);
        getFilesOfUser(userId);
    }, [])





    return (
        <>
            <LeftSideBar data={{ pageName: "Folder", index: 2 }}>
                <Grid>
                    <Button variant="contained" color="primary" onClick={() => createFolder()}>
                        Create Folder
                    </Button>
                </Grid>
                <Grid container spacing={1}>
                    {
                        folderDataStore.map((FolDataObj) => folderGrid(getRandomDigit(), FolDataObj))
                    }
                </Grid>

                {open &&
                    <Dialog onClose={handleClose} open={open}>
                        <DialogTitle>Select File and add in folder</DialogTitle>
                        <List sx={{ pt: 0 }}>
                            {userFiles.map((fileObjs) => (
                                <ListItem
                                //  disableGutters
                                >
                                    <ListItemButton onClick={() => addFileInFolder(fileObjs.fileId)} key={fileObjs.fileId}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <NoteAddIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={fileObjs.fileName} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Dialog>
                }

            </LeftSideBar>
        </>
    )
}

export default Folder