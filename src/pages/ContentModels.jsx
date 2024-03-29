import React, { useEffect, useState } from 'react'
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Grid, Typography, TextField, Autocomplete, FormControlLabel, FormGroup, Checkbox, Tooltip, CircularProgress
} from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { toast } from 'react-toastify';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useDebounce } from 'use-debounce';
import { useLocation, useNavigate } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import { removeFileApi } from '../api/InternalApi/OurDevApi';
import appConfig from "../Config";
import {
    createChannel, describeChannel, listChannelMembershipsForAppInstanceUser, getAwsCredentialsFromCognito,
    sendChannelMessage, listChannelMessages, createChannelMembership
}
    from "../api/ChimeApi/ChimeApi";


import { getAllUsersFromCognitoIdp, setAuthenticatedUserFromCognito } from "../api/CognitoApi/CognitoApi";

//////////get the all users from congnito ///////////////////
import { IdentityService } from '../services/IdentityService.js';

const ContentModels = ({
    activeModel,
    setActiveModel,
    setOpenNewModel,
    setShow,
    show,
    NewModelOpen,
    setNewModelOpen,
    getFoldersData,
    folderSelect,
    ActiveChannel,
}) => {
    const navigate = useNavigate();
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('xs');

    const location = useLocation();
    ////////// Create and store Identity service //////
    const [IdentityServiceObject] = useState(
        () => new IdentityService(appConfig.region, appConfig.cognitoUserPoolId)
    );


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

    //////////// Store the userid of user ////////
    const [user_id, setUserID] = useState("");

    //////////When this page render then user_id store , nad channel list also load
    useEffect(() => {
        getAwsCredentialsFromCognito();
        IdentityServiceObject.setupClient();
        let getLoginUserName = localStorage.getItem(`CognitoIdentityServiceProvider.${appConfig.cognitoAppClientId}.LastAuthUser`);
        let selectUserData = localStorage.getItem(`CognitoIdentityServiceProvider.${appConfig.cognitoAppClientId}.${getLoginUserName}.userData`);
        let userid = (JSON.parse(selectUserData).UserAttributes.find((d) => d.Name === "profile")).Value;
        setUserID(userid)
    }, [])

    ////////// channel state value save here

    //////// Here we are store a channel name list //////
    const [channelList, setChannelList] = useState([]);
    const [channelName, setChannelName] = useState("");
    const [channelDiscription, setChannelDiscription] = useState("");

    const createChannelFun = async () => {
        if (channelName === "") {
            toast.info("Please enter channel name");
            return;
        }
        if (channelName != null && channelName != "") {
            const creatChannelObj = {
                "instenceArn": `${appConfig.appInstanceArn}`,
                "metaData": null,
                "newName": `${channelName}`,
                "mode": "RESTRICTED",
                "privacy": "PRIVATE",
                "elasticChannelConfiguration": null,
                "userId": `${user_id}`
            }//////// These object types value pass in createChannel function 
            const channelArn = await createChannel(`${appConfig.appInstanceArn}`, null,
                `${channelName}`, "RESTRICTED", "PRIVATE", null, `${user_id}`);/////////By this function we are  creating the channnel
            if (channelArn) {
                const channel = await describeChannel(channelArn, user_id);
                if (channel) {
                    // await channelListFunction(user_id);
                    toast.success("Channel created successfully.");
                } else {
                    console.log('Error, could not retrieve channel information.');
                }
            } else {
                console.log('Error, could not create new channel.');
            }
        }
        handleClose();
    }

    /////////// Get the channel list 
    const channelListFunction = async (userid) => {
        const userChannelMemberships = await listChannelMembershipsForAppInstanceUser(
            userid
        );
        const userChannelList = userChannelMemberships.map(
            (channelMembership) => {
                const channelSummary = channelMembership.ChannelSummary;
                channelSummary.SubChannelId =
                    channelMembership.AppInstanceUserMembershipSummary.SubChannelId;
                return channelSummary;
            }
        );
        setChannelList(userChannelList);
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

            const response = await axios.post('https://devorganaise.com/api/createFolder', folderData, {
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



    /////////////////////////////////////////////////////////////
    ////////when add file model open then all file api call here
    /////// Get files of this user
    //////////////////////////////////////////////////////////////
    const [userFiles, setUserFiles] = useState([]);
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
            const newCheckedArray = FilesData.map(checkbox => {
                const match = folderSelect.filesList.find(obj2 => checkbox.fileId === obj2.fileId);
                return match ? { ...checkbox, checked: true } : { ...checkbox, checked: false };
            });
            setUserFiles(newCheckedArray);
        } else {
            toast.error(FilesResponse.message);
        }

    }
    const callGetAllFileFun = () => {
        const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
        if (UserId) {
            getFilesOfUser(UserId);
        }
    }


    //////////// search file by typing file name
    const [srcFileName, setSrcFileName] = useState('');
    const [debouncedSearchTerm] = useDebounce(srcFileName, 500);


    useEffect(() => {
        if (debouncedSearchTerm !== "") {
            const searchingFiles = userFiles.filter((srcFiles) => srcFiles.fileName.toLowerCase().startsWith(debouncedSearchTerm.toLowerCase()));
            setUserFiles(searchingFiles);
        } else {
            if (activeModel === "AddFileModel") {
                callGetAllFileFun();
            }
        }
    }, [activeModel, debouncedSearchTerm])


    //////////////////////////////////////////////
    ///////// adding flie in folder first staging
    //////////////////////////////////////////////
    //// Remov the dublicate from arrayof object
    function removeDuplicateObjectFromArray(array, key) {
        var check = new Set();
        return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
    }

    const [selectedFile, setSelectedFile] = useState([]);
    const addFileInFolder = (event, fileData) => {
        const updatedCheckboxes = userFiles.map((checkbox) => {
            if (checkbox.fileId === fileData.fileId) {
                return {
                    ...checkbox,
                    checked: !checkbox.checked,
                };
            }
            return checkbox;
        });
        setUserFiles(updatedCheckboxes);
        const mySelectedFies = updatedCheckboxes.filter((checkedFiles) => checkedFiles.checked === true);
        //  setSelectedFile(removeDuplicateObjectFromArray([...selectedFile, ...mySelectedFies], "fileId"));/////remove the dublicaate
        setSelectedFile(mySelectedFies);
    }

    //////////// adding file api call here
    ////// Add file in folder
    const addIngFileInFolder = async (userId, fileId, selectedFolder) => {
        
        const addFileInFolderObject = { userId: userId, folderId: selectedFolder, fileId: fileId }
        const response = await axios.post('https://devorganaise.com/api/addFileInFolder', addFileInFolderObject, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const AddFilesResponse = response.data;
        if (AddFilesResponse.status) {
            //nothing here
        } else {
            toast.error(AddFilesResponse.message);
        }

    }

    ///////// When click on the add file button
    const [AddBtnDisable, setAddBtnDisable] = useState(false);
    const FinalAddFileInFolder = async () => {
        if(selectedFile.length === 0) {
            return null;
        }
        setAddBtnDisable(true);
        const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
        for (let index = 0; index < selectedFile.length; index++) {
            await addIngFileInFolder(UserId, selectedFile[index], folderSelect._id);
            if (selectedFile.length - 1 === index) {
                toast.success("Files added successfully");
                setAddBtnDisable(false);
                getFoldersData(UserId);
                handleClose();
            }

        }
    }


    /////////////////////////////////////////////
    /////////////// Get files in the folder//////
    /////////////////////////////////////////////
    const [folderFiles, setFolderFiles] = useState([]);
    useEffect(() => {
        if (activeModel === "ShowFilesInFolderModel") {
            setFolderFiles(folderSelect.filesList);
        }
    }, [activeModel, folderSelect])

    ////////// remove file from folder
    const removeFileApiFun = async (folderId, fileData) => {
        const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
        const createObj = { folderId: folderId, userId: UserId, fileId: fileData }
        try {
            const callRemoveFileApi = await removeFileApi(createObj);
            if (callRemoveFileApi.status) {
                const leftFilesData = folderSelect.filesList.filter((fileDa) => fileDa.fileId !== fileData.fileId);
                setFolderFiles(leftFilesData);
                toast.success(callRemoveFileApi.message);
                getFoldersData(UserId);
            } else {
                toast.error(callRemoveFileApi.message);
            }
        } catch (error) {
            toast.error("Somethig is wrong.");
        }

    }



    /////////////////// add team mate model code  here
    //////// All users list store here //////
    const [AddAllUsers, SetAllUsersList] = useState([]);
    ////////// Whenn user id set then this useEffect run
    useEffect(() => {
        if ((user_id !== "") && (location.pathname === "/")) {
            //setChannelInterval
            channelListFunction(user_id);
            getAllUsersFromCognitoIdp(IdentityServiceObject).then((uData) => {
                if (uData.status) {
                    SetAllUsersList(uData.data)
                } else {
                    toast.error("Something is wrong.");
                    console.log("Something is wrong", uData);
                }
            }).catch((err) => {
                console.log("Something is wrong error get  when user list get", err);
            });
        }
    }, [user_id, location]);



    /////////// when click on the add button in teammate model
    const [selectUserSave, setAddUserObj] = useState(null);

    /////////// When click on the select user then this function run here
    const selectUserFun = async () => {
        const response = await AddMemberButton(ActiveChannel, selectUserSave, user_id);
        if (response.status) {
            toast.success("Member added successfully");
        } else {
            toast.error("Something is wrong.Member not add in channel");
        }
    }

    const AddMemberButton = async (selectChannel, selectUser, user_id) => {
        try {
            const membership = await createChannelMembership(
                selectChannel.ChannelArn,
                `${appConfig.appInstanceArn}/user/${selectUser.value}`,
                user_id,
                undefined //activeChannel.SubChannelId
            );
            const memberships = []  ///activeChannelMemberships;
            memberships.push({ Member: membership });
            handleClose();
            return { status: true, data: memberships }
        } catch (err) {
            toast.error("Something is wrong please try after some time");
            console.log("error in adding member in channel", err);
            return { status: false, error: err };
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

            {/* create folder model */}
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
                                    options={AddAllUsers}
                                    onChange={(event, newValue) => {
                                        setAddUserObj(newValue);
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    getOptionSelected={(option, value) => option.value === value.value}
                                    renderOption={(props, option) => (
                                        <div {...props}>
                                            <div>{option.label}</div>
                                            {/* <div>{option.value}</div> */}
                                        </div>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Username"
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
                                onClick={() => selectUserFun()}
                            >
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
                                    Please select the files you want to add in the <b>{folderSelect.folderName}</b>&nbsp;folder.
                                </Typography>
                            </Box>
                        </DialogContentText>
                        <Box px={"15px"} container id="add_channel_name" mt={0}>
                            <Box mb={1} mt={1.5} container sx={{ width: "100%" }}>
                                {/* Search file code here */}
                                <TextField
                                    id="search_file_here"
                                    label="Search File"
                                    size='small'
                                    sx={{ width: "100%" }}
                                    value={srcFileName}
                                    onChange={(e) => setSrcFileName(e.target.value)}
                                />
                            </Box>
                            <Box container sx={{ width: "100%" }} mt={0}>
                                {userFiles.length !== 0 && userFiles.map((fd, indexFile) => (
                                    indexFile < 5 &&
                                    <Box key={`index_file_model_${indexFile}`} container pl={0.7}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={(e) => addFileInFolder(e, fd)}
                                                    checked={fd?.checked || false}
                                                    key={`checkBox_index_${indexFile}`}
                                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 22 }, padding: "5px" }}
                                                />
                                            }
                                            label={`${fd.fileName}`}
                                        />
                                    </Box>
                                ))}

                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Box sx={{ width: "100%" }} display={"flex"} justifyContent="space-between">
                            <Box px={"25px"} py={"15px"} sx={{ width: "100%", cursor: "pointer" }} display={"flex"}>
                                <AddIcon />
                                <Typography
                                    onClick={() => navigate("/upload")}
                                    variant="subtitle2" >
                                    Add new file
                                </Typography>
                            </Box>
                            <Box px={"15px"} py={1.5} container sx={{ width: "100%" }} gap={2} display="flex" justifyContent={"end"}>
                                <Button
                                    variant="outlined"
                                    size='small'
                                    sx={{ padding: "5px 30px", width: "100%" }}
                                    onClick={() => handleClose()}


                                >
                                    Discard
                                </Button>
                                <Button
                                    variant="contained"
                                    size='small'
                                    sx={{ padding: "5px 30px", width: "100%" }}
                                    onClick={() => FinalAddFileInFolder()}
                                    disabled={AddBtnDisable}
                                >
                                    {selectedFile.length === 0 ? "Add" : `Add ${selectedFile.length}`}
                                    {AddBtnDisable && <CircularProgress
                                        size={15}
                                        style={{
                                            position: 'absolute',
                                            top: '66%',
                                            right: '7%',
                                            marginTop: -12,
                                            marginLeft: -12,
                                            color: "primary"
                                        }}
                                    />}
                                </Button>
                            </Box>
                        </Box>

                    </DialogActions>
                </Dialog>
            }

            {/* show files in folder */}
            {show && activeModel === "ShowFilesInFolderModel" &&
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
                            <Typography variant="h6" fontWeight={"600"} color="#333333" align='center' mb={1}>Files in folder {folderSelect.folderName}</Typography>
                            <Box>
                                <Typography variant="subtitle2" align='center' >
                                    {/* All files in folder ABC. */}
                                </Typography>
                            </Box>
                        </DialogContentText>
                        <Box px={"15px"} container id="add_channel_name" mt={0}>

                            <Box mb={1} mt={1.5} container sx={{ width: "100%" }}>
                                {/* Search file code here */}
                                {folderFiles.length !== 0 &&
                                    <TextField
                                        id="search_file_here"
                                        label="Search File"
                                        size='small'
                                        sx={{ width: "100%" }}
                                    // value={srcFileName}
                                    // onChange={(e) => setSrcFileName(e.target.value)}
                                    />
                                }

                                {folderFiles.length === 0 && <Typography variant="subtitle2" color={"#820909b8"}> Files are not available in this folder. Please first add the file in this folder.</Typography>}
                            </Box>
                            <Box container sx={{ width: "100%" }} mt={0}>
                                {folderFiles.length !== 0 && folderFiles.map((fd, indexFile) => (
                                    // indexFile < 5 &&
                                    <Box key={`index_file_model_${indexFile}`} display="flex" justifyContent={"space-between"} container pl={0.7}>
                                        {/* <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={(e) => addFileInFolder(e, fd)}
                                                    defaultChecked={false}
                                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 22 }, padding: "5px" }}
                                                />
                                            }
                                            label={`${fd.fileName}`}
                                        /> */}
                                        <Typography variant="subtitle2">
                                            {fd.fileName}
                                        </Typography>
                                        <Tooltip title="Remove file from folder" placement="top" arrow>
                                            <CancelIcon
                                                onClick={() => removeFileApiFun(folderSelect._id, fd)}
                                                sx={{ fontSize: "15px", color: "#820909b8", "&:hover": { color: "#820909", cursor: "pointer" } }}
                                            />
                                        </Tooltip>

                                    </Box>
                                ))}

                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Box sx={{ width: "100%" }} display={"flex"} justifyContent="space-between">
                            <Box px={"25px"} py={"15px"} sx={{ width: "100%", cursor: "pointer" }} display={"flex"}>
                                {/* <AddIcon />
                                <Typography onClick={() => navigate("/upload")} variant="subtitle2" >Add new file</Typography> */}
                            </Box>
                            <Box px={"15px"} py={1.5} container sx={{ width: "100%" }} gap={2} display="flex" justifyContent={"end"}>
                                <Button
                                    variant="outlined"
                                    size='small'
                                    sx={{ padding: "5px 30px" }}
                                    onClick={() => handleClose()}>
                                    Close
                                </Button>
                                {/* <Button
                                    variant="contained"
                                    size='small'
                                    sx={{ padding: "5px 30px" }}
                                    onClick={() => FinalAddFileInFolder()}
                                >
                                    Add
                                </Button> */}
                            </Box>
                        </Box>

                    </DialogActions>
                </Dialog>
            }

        </>
    )
}

export default ContentModels