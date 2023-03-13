import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from '@mui/material';
import Papa from "papaparse";
import React, { useState, useCallback, useContext, useMemo, } from 'react'
import { useDropzone } from 'react-dropzone';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import axios from "axios";
import { toast } from 'react-toastify';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SuccessSvg from "../../assets/svg/success.svg";
import CircularProgress from '@mui/material/CircularProgress';
import { Navigate, useNavigate } from 'react-router-dom';


const FileUploadModal = ({ handleClose, open, setJsonData, handleClickOpen, userId }) => {
    const navigate = useNavigate();
    const [fileGet, setFile] = useState();
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const [ShowFiles, SetFileData] = useState([]);
    const [show, setShow] = useState(false);

    const [loader, setLoader] = useState(false);

    // const onDrop = useCallback((acceptedFiles) => {
    //     acceptedFiles.forEach((file) => {
    //         { setFile(file) }
    //         { console.log(file) }
    //     })
    // }, [])

    // const {
    //     getRootProps,
    //     getInputProps
    // } = useDropzone({ onDrop });


    const convertToJson = () => {
        Papa.parse(fileGet, {
            complete: (results) => {
                console.log(results);
                setJsonData(results.data);
                handleClose();
            },
        });
    };


    const uploadFileData = async () => {
        setLoader(true);
        const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
        for (let index = 0; index < ShowFiles.length; index++) {
            let fileData = ShowFiles[index];
            const formData = new FormData();
            formData.append('fileData', fileData);
            formData.append('userId', UserId);
            formData.append('fileSize', fileData.size);
            const response = await axios.post('https://devorganaise.com/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (ShowFiles.length - 1 === index) {
                if (response?.data?.Key) {
                    setLoader(false)
                    toast.success(`File uploaded successfully`);
                    // ${response.data.Key.split(".")[0]}
                    handleClose();
                    navigate("/allFiles");
                } else {
                    setLoader(false);
                    toast.error("Something is wrong");
                }
            }

        }


    }

    const FileModelStyle = {
        fileText: {
            color: "#222222",
            fontSize: "13px",
            lineHeight: 1.64,
            cursor: "pointer",
        },
        SubFileText: {
            color: "#888888",
            fontSize: "10px !important",
            lineHeight: 1.3,
        },
    }


    const baseStyle = {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        borderWidth: 2,
        borderRadius: 10,
        // borderColor: "#eeeeee",
        borderStyle: "dashed",
        border: "2px dashed #B0B0B0",
        backgroundColor: "#ffffff",
        color: "#bdbdbd",
        outline: "none",
        transition: "border .24s ease-in-out",
        marginTop: "10px"
    };

    const activeStyle = {
        borderColor: "#2196f3",
    };

    const acceptStyle = {
        borderColor: "#2e75bb",
        backgroundColor: "rgba(46, 117, 187, 0.1)",
    };

    const rejectStyle = {
        borderColor: "#ff1744",
    };

    ///// File uploading Code

    const onDrop = useCallback(
        // Inside here we are write the code to upload the file
        // id is get by useparams
        (acceptedFiles) => {
            let allFiles = [];
            const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
            acceptedFiles.forEach((file, index) => {
                let fileData = new FormData();
                fileData.append(`file_${index}`, file);
                fileData.append('userId', UserId);
                fileData.append('fileSize', file.size);
                // formData.append("project_id", id);
                const fileDataSet = [file];
                allFiles.push(file);
            });
            //   setFileUpload([...getFileUpload ,...allFiles]);///contextApi
            //   SetFileData([...getFileUpload ,...allFiles]);///useState data
            SetFileData([...allFiles]);///useState data
        },
        [
            //id, mutateAsync, dispatch
            //    ,getFileUpload
        ]
    );

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({ onDrop });

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isDragActive, isDragReject, isDragAccept]
    );

    const handleFileDelete = (e, file) => {
        e.stopPropagation();
        const delFileFilter = ShowFiles.filter((d) => ((d.name !== file.name) && (d.size !== file.size)));
        SetFileData(delFileFilter);///useState data
    };
    const downloadFile = (e, file) => {
        e.stopPropagation();
    };


    /////// When file upload then  files show in upload box
    const files = (
        <Grid container style={{ padding: "10px 0" }}>
            {
                ShowFiles.length !== 0 &&
                ShowFiles.map((file, index) => (
                    <Grid
                        key={"key-" + file.name}
                        container
                        style={{ padding: "0px 0" }}
                        justify="space-between"
                    >
                        <Grid item>
                            <Box display="flex" alignItems="center">
                                <TaskOutlinedIcon
                                    color="secondary"
                                    style={{ marginRight: "10px" }}
                                />
                                <Box>
                                    <Typography
                                        // onClick={(e) => downloadFile(e, file)}
                                        sx={FileModelStyle.fileText}
                                    >
                                        {file.name}
                                    </Typography>
                                    <Typography variant='body2' sx={FileModelStyle.SubFileText}>
                                        {(file.size / 1024).toFixed(2)} KB
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item sx={{ paddingTop: "4px", paddingLeft: "4px" }}>
                            <Box display="flex" alignItems="center">
                                {show && (
                                    <CancelOutlinedIcon
                                        key={`key_cancel-${file.name}-${index}`}
                                        style={{ cursor: "pointer" }}
                                        onClick={(e) => handleFileDelete(e, file)}
                                        //onMouseOut={() => setShow(false)}
                                        color="secondary"
                                        fontSize="10px"
                                        mt={1}
                                    />
                                )}
                                {!show && (
                                    <img
                                        onMouseOver={() => setShow(true)}
                                        src={SuccessSvg}
                                        alt="upload successful"
                                    />
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                ))}
            {/* {isLoading && <CircularProgress size={15} color="primary" />} */}
        </Grid>
    );


    return (
        <>
            <Dialog
                open={open}
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
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography variant="h6" fontWeight={"600"} align='center' color="#333333" mb={1}>Upload Data</Typography>
                        <Box px={"10%"}>
                            <Typography variant="subtitle2" align='center'>
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                            </Typography>
                        </Box>
                    </DialogContentText>
                    <Box px={"2.5%"} mt={2} sx={{ cursor: "pointer" }}>
                        <div {...getRootProps({
                            //className: 'dropzone' 
                            style
                        })}>

                            <Grid mt={2} xs={12} item container display={"grid"}>
                                <Box container display={"flex"} justifyContent="center">
                                    <CloudUploadOutlinedIcon sx={{ fontSize: "25px", color: "#BABABA" }} />
                                </Box>
                                <Box container>
                                    <Typography variant="subtitle2" align='center' color={"#333333"} >
                                        Drag and drop or Browse to choose data
                                    </Typography>
                                </Box>
                                <Box container>
                                    <Typography sx={{ fontWeight: "400", fontSize: "12px", color: "#C5C5C5" }} variant="subtitle2" align='center' >
                                        Supports Excel and CSV Files
                                    </Typography>
                                </Box>

                            </Grid>
                            <input {...getInputProps()} />
                            {/* <p>Drag 'n' drop some files here, or click to select files</p>
                        <em>(Only *.jpeg and *.png images will be accepted)</em> */}

                        </div>
                        <Box mt={3} sx={{ display: "flex", justifyContent: "end" }}>
                            <Button mr="10px" sx={{
                                paddingLeft: "25px", paddingRight: '25px',
                                backgroundColor: "#ffffff", textTransform: "capitalize", marginRight: "10px"
                            }}
                                size='small' variant='outlined' >Cancel
                            </Button>
                            <Button
                                sx={{
                                    paddingLeft: "25px", paddingRight: '25px',
                                    backgroundColor: "primary", textTransform: "capitalize"
                                }}
                                size='small'
                                variant='contained'
                                onClick={() => uploadFileData()}
                                disabled={loader}
                            >
                                Upload Now
                                {loader && (
                                    <CircularProgress
                                        size={15}
                                        style={{
                                            position: 'absolute',
                                            top: '65%',
                                            right: '3%',
                                            marginTop: -12,
                                            marginLeft: -12,
                                            color: "primary"
                                        }}
                                    />
                                )}
                            </Button>
                        </Box>
                    </Box>
                    {files}
                </DialogContent>
                <DialogActions>


                    {/* 
                    <Button onClick={convertToJson} autoFocus>
                        Agree
                    </Button> 
                    */}
                </DialogActions>
            </Dialog>
        </>
    )
}

export default FileUploadModal