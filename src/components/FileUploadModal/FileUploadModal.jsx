import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from '@mui/material';
import Papa from "papaparse";
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import axios from "axios";
import { toast } from 'react-toastify';
const FileUploadModal = ({ handleClose, open, setJsonData, handleClickOpen ,userId }) => {
    const [fileGet, setFile] = useState();
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('xs');


    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            { setFile(file) }
            { console.log(file) }
        })
    }, [])

    const {
        getRootProps,
        getInputProps
    } = useDropzone({ onDrop });


    const convertToJson = () => {
        Papa.parse(fileGet, {
            complete: (results) => {
                console.log(results);
                setJsonData(results.data);
                handleClose();
            },
        });
    };


    const uploadFileData = async (fileGet) => {
        let fileData = fileGet;
        const formData = new FormData();
        formData.append('fileData', fileData);
        formData.append('userId', userId);
        formData.append('folderName', "");
        const response = await axios.post('http://13.56.89.225/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.statusText === "OK") {
            toast.success(`File uploaded successfully ${response.data.Key.split(".")[0]}`);
            handleClose();
        } else {
            toast.error("Something is wrong");
        }
    }


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
                    <Box display={"flex"} justifyContent="space-between">
                        <Typography variant="subtitle2" color="#333333">Upload Files</Typography>
                        <ClearOutlinedIcon sx={{ cursor: "pointer", color: "#333333" }} onClick={() => handleClose()} />
                    </Box>

                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    </DialogContentText>
                    <div {...getRootProps({ className: 'dropzone' })}>

                        <Grid mt={2} xs={12} item container display={"flex"} justifyContent="center">
                            <Box p={6} style={{ backgroundColor: "#efefef", borderRadius: "10px" }}>
                                <Box px={1.8} py={1.2} style={{ backgroundColor: "#5454d3", borderRadius: "5px" }}>
                                    <CloudUploadOutlinedIcon sx={{ fontSize: "30px", color: "#fff" }} />
                                </Box>
                            </Box>
                        </Grid>
                        <input {...getInputProps()} />
                        {/* <p>Drag 'n' drop some files here, or click to select files</p>
                        <em>(Only *.jpeg and *.png images will be accepted)</em> */}

                    </div>
                    <Box mt={3} sx={{ display: "flex", justifyContent: "center" }}>
                        <Button sx={{
                            paddingLeft: "50px", paddingRight: '50px',
                            backgroundColor: "#03CF80", textTransform: "capitalize"
                        }}
                            size='large' variant='contained' onClick={() => uploadFileData(fileGet)}>Upload Now</Button>
                    </Box>
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