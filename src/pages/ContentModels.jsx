import React, { useEffect, useState } from 'react'
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Grid, Typography, TextField, Autocomplete, FormControlLabel, FormGroup, Checkbox
} from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { toast } from 'react-toastify';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';


const ContentModels = ({ activeModel, setActiveModel, setOpenNewModel, setShow, show, NewModelOpen, setNewModelOpen, getFoldersData }) => {

    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('xs');


    const handleClickOpen = () => {
        setNewModelOpen(true);
    };
    const handleClose = () => {
        setNewModelOpen(false);
        setOpenNewModel(false);
        setShow(false);
        setActiveModel("");
    };

    ////dummy data
    const top100Films = [
        { title: 'The Shawshank Redemption', year: 1994 },
        { title: 'The Godfather', year: 1972 },
        { title: 'The Godfather: Part II', year: 1974 },
    ]



    ////////// channel state value save here
    const [channelName, setChannelName] = useState("");
    const [channelDiscription, setChannelDiscription] = useState("");
    const createChannelFun = () => {
        if (channelName === "") {
            toast.info("Please enter channel name");
            return;
        }
        console.log(channelName, channelDiscription);
    }

    ///////// Create folder function and aadd staates here
    const [folderName, setFolderName] = useState("");
    const [folderDiscription, setFolderDiscription] = useState("");

    const createFolderFun = async () => {
        if (folderName === "") {
            toast.info("Please enter folder name");
            return;
        }
        if (folderName) {
            const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
            const folderData = {
                folderName: folderName,
                folderDiscription: folderDiscription,
                userId: UserId
            }

            const response = await axios.post('http://localhost:8000/api/createFolder', folderData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const folderResponse = response.data;
            if (folderResponse.status) {
                toast.success(folderResponse.message);
                const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
                getFoldersData(UserId);
                handleClose();
            } else {
                toast.error(folderResponse.message);
            }

        }
    }





    return (
        <>

            {/* add channel model */}
            {show && activeModel === "AddChannel" &&
                <Dialog
                    open={NewModelOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={fullWidth}
                    maxWidth={maxWidth}
                    disableEscapeKeyDown={true}
                >
                    <DialogTitle id="alert-dialog-title">
                        <Box display={"flex"} justifyContent="end">
                            <ClearOutlinedIcon sx={{
                                cursor: "pointer",
                                color: "#333333",
                                fontSize: "18px",
                                borderRadius: "50%",
                                border: "1px solid #33333342",
                                padding: "2px"
                            }} onClick={() => handleClose()} />
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ paddingBottom: "0px" }}>
                        <DialogContentText id="alert-dialog-description">
                            <Typography variant="h6" fontWeight={"600"} color="#333333" mb={1}>Add Channel</Typography>
                            <Box >
                                <Typography variant="subtitle2" >
                                    Start a chat conversation with creating channels and add
                                    your teammates.
                                </Typography>
                            </Box>
                        </DialogContentText>
                        <Box container id="add_channel_name" mt={2}>
                            <Box container sx={{ width: "100%" }}>
                                <TextField
                                    id="channel_name_input"
                                    label="Channel name"
                                    size='small'
                                    sx={{ width: "100%" }}
                                    value={channelName}
                                    onChange={(e) => setChannelName(e.target.value)}
                                />
                            </Box>
                            <Box container sx={{ width: "100%" }} mt={1}>
                                <TextareaAutosize
                                    minRows={4}
                                    maxRows={4}
                                    aria-label="maximum height"
                                    placeholder="Channel Description (Maximum 200 Words)"
                                    defaultValue={""}
                                    style={{ padding: "10px 15px", fontFamily: "sans-serif", fontSize: "14px", width: "100%", height: "80px !important", resize: "none", boxSizing: "border-box" }}
                                    onChange={(e) => setChannelDiscription(e.target.value)}
                                />
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Box px={"15px"} py={1.5} container sx={{ width: "100%" }} gap={2} display="flex" justifyContent={"end"}>
                            <Button
                                variant="outlined"
                                size='small'
                                sx={{ padding: "5px 30px" }}
                                onClick={() => handleClose()}
                            >
                                Discard
                            </Button>
                            <Button
                                variant="contained"
                                size='small'
                                sx={{ padding: "5px 30px" }}
                                onClick={() => createChannelFun()}
                            >
                                Create Channel
                            </Button>
                        </Box>
                    </DialogActions>
                </Dialog>
            }

            {/* add channel model */}
            {show && activeModel === "CreateFolder" &&
                <Dialog
                    open={NewModelOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={fullWidth}
                    maxWidth={maxWidth}
                    disableEscapeKeyDown={true}
                >
                    <DialogTitle id="alert-dialog-title">
                        <Box display={"flex"} justifyContent="end">
                            <ClearOutlinedIcon sx={{
                                cursor: "pointer",
                                color: "#333333",
                                fontSize: "18px",
                                borderRadius: "50%",
                                border: "1px solid #33333342",
                                padding: "2px"
                            }} onClick={() => handleClose()} />
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ paddingBottom: "0px" }}>
                        <DialogContentText id="alert-dialog-description_folder">
                            <Typography variant="h6" fontWeight={"600"} color="#333333" mb={1}>Create Folder</Typography>
                            <Box >
                                <Typography variant="subtitle2" >
                                    Arrange your file just simply create a folder and add files in a folder.
                                </Typography>
                            </Box>
                        </DialogContentText>
                        <Box container id="add_folder_name_box" mt={2}>
                            <Box container sx={{ width: "100%" }}>
                                <TextField
                                    id="folderl_name_input"
                                    label="Folder name"
                                    size='small'
                                    sx={{ width: "100%" }}
                                    value={folderName}
                                    onChange={(e) => setFolderName(e.target.value)}
                                />
                            </Box>
                            <Box container sx={{ width: "100%" }} mt={1}>
                                <TextareaAutosize
                                    minRows={4}
                                    maxRows={4}
                                    aria-label="maximum height"
                                    placeholder="Folder Description (Maximum 200 Words) optional"
                                    defaultValue={""}
                                    style={{ padding: "10px 15px", fontFamily: "sans-serif", fontSize: "14px", width: "100%", height: "80px !important", resize: "none", boxSizing: "border-box" }}
                                    onChange={(e) => setFolderDiscription(e.target.value)}
                                />
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Box px={"15px"} py={1.5} container sx={{ width: "100%" }} gap={2} display="flex" justifyContent={"end"}>
                            <Button
                                variant="outlined"
                                size='small'
                                sx={{ padding: "5px 30px" }}
                                onClick={() => handleClose()}
                            >
                                Discard
                            </Button>
                            <Button
                                variant="contained"
                                size='small'
                                sx={{ padding: "5px 30px" }}
                                onClick={() => createFolderFun()}
                            >
                                Create Folder
                            </Button>
                        </Box>
                    </DialogActions>
                </Dialog>
            }

            {/* Add teammate model */}
            {show && activeModel === "AddTeamMate" &&
                <Dialog
                    open={NewModelOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={fullWidth}
                    maxWidth={maxWidth}
                    disableEscapeKeyDown={true}
                >
                    <DialogTitle id="alert-dialog-title">
                        <Box display={"flex"} justifyContent="end">
                            <ClearOutlinedIcon sx={{
                                cursor: "pointer",
                                color: "#333333",
                                fontSize: "18px",
                                borderRadius: "50%",
                                border: "1px solid #33333342",
                                padding: "2px"
                            }} onClick={() => handleClose()} />
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ paddingBottom: "0px" }}>
                        <DialogContentText id="alert-dialog-description">
                            <Typography variant="h6" fontWeight={"600"} color="#333333" mb={1}>Add Teammates</Typography>
                            <Box >
                                <Typography variant="subtitle2" >
                                    Start a chat conversation with adding teammates via email
                                    Chat directly with them for fast solutions.
                                </Typography>
                            </Box>
                        </DialogContentText>
                        <Box container id="add_channel_name" mt={3}>
                            <Box container sx={{ width: "100%" }}>
                                <Autocomplete
                                    freeSolo
                                    id="search_teammate_and_add"
                                    disableClearable
                                    options={top100Films.map((option) => option.title)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Email address"
                                            InputProps={{
                                                ...params.InputProps,
                                                type: 'search',
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                            <Box container sx={{ width: "100%" }} mt={1}>
                                <TextareaAutosize
                                    minRows={4}
                                    maxRows={4}
                                    aria-label="maximum height"
                                    placeholder="Adding Reason(Maximum 200 Words)"
                                    defaultValue={""}
                                    style={{ padding: "10px 15px", fontFamily: "sans-serif", fontSize: "14px", width: "100%", height: "80px !important", resize: "none", boxSizing: "border-box" }}
                                />
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Box px={"15px"} py={1.5} container sx={{ width: "100%" }} gap={2} display="flex" justifyContent={"end"}>
                            <Button variant="outlined" size='small' sx={{ padding: "5px 30px" }}>
                                Discard
                            </Button>
                            <Button variant="contained" size='small' sx={{ padding: "5px 30px" }}>
                                Add
                            </Button>
                        </Box>
                    </DialogActions>
                </Dialog>
            }
            {/* Add files in folder */}
            {show && activeModel === "AddFileModel" &&
                <Dialog
                    open={NewModelOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={fullWidth}
                    maxWidth={maxWidth}
                    disableEscapeKeyDown={true}
                >
                    <DialogTitle id="alert-dialog-title">
                        <Box display={"flex"} justifyContent="end">
                            <ClearOutlinedIcon sx={{
                                cursor: "pointer",
                                color: "#333333",
                                fontSize: "18px",
                                borderRadius: "50%",
                                border: "1px solid #33333342",
                                padding: "2px"
                            }} onClick={() => handleClose()} />
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ paddingBottom: "0px" }}>
                        <DialogContentText id="alert-dialog-description">
                            <Typography variant="h6" fontWeight={"600"} color="#333333" align='center' mb={1}>Add Files</Typography>
                            <Box >
                                <Typography variant="subtitle2" align='center' >
                                    Please select the files you want to add in the ABC folder.
                                </Typography>
                            </Box>
                        </DialogContentText>
                        <Box px={"15px"} container id="add_channel_name" mt={0}>
                            <Box container sx={{ width: "100%" }}>
                                {/* Search file code here */}
                            </Box>
                            <Box container sx={{ width: "100%" }} mt={0}>
                                <Box container pl={0.7}>
                                    <FormControlLabel control={<Checkbox defaultChecked={false} sx={{ '& .MuiSvgIcon-root': { fontSize: 22 }, padding: "5px" }} />} label="Excel 1" />
                                </Box>
                                <Box container pl={0.7}>
                                    <FormControlLabel control={<Checkbox defaultChecked={false} sx={{ '& .MuiSvgIcon-root': { fontSize: 22 }, padding: "5px" }} />} label="Excel 1" />
                                </Box>
                                <Box container pl={0.7}>
                                    <FormControlLabel control={<Checkbox defaultChecked={false} sx={{ '& .MuiSvgIcon-root': { fontSize: 22 }, padding: "5px" }} />} label="Excel 1" />
                                </Box>
                                <Box container pl={0.7}>
                                    <FormControlLabel control={<Checkbox defaultChecked={false} sx={{ '& .MuiSvgIcon-root': { fontSize: 22 }, padding: "5px" }} />} label="Excel 1" />
                                </Box>
                                <Box container pl={0.7}>
                                    <FormControlLabel control={<Checkbox defaultChecked={false} sx={{ '& .MuiSvgIcon-root': { fontSize: 22 }, padding: "5px" }} />} label="Excel 1" />
                                </Box>

                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Box sx={{ width: "100%" }} display={"flex"} justifyContent="space-between">
                            <Box px={"25px"} py={"15px"} sx={{ width: "100%", cursor: "pointer" }} display={"flex"}>
                                <AddIcon />
                                <Typography variant="subtitle2" >Add new file</Typography>
                            </Box>
                            <Box px={"15px"} py={1.5} container sx={{ width: "100%" }} gap={2} display="flex" justifyContent={"end"}>
                                <Button variant="outlined" size='small' sx={{ padding: "5px 30px" }}>
                                    Discard
                                </Button>
                                <Button variant="contained" size='small' sx={{ padding: "5px 30px" }}>
                                    Add
                                </Button>
                            </Box>
                        </Box>

                    </DialogActions>
                </Dialog>
            }

        </>
    )
}

export default ContentModels