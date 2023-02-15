import React, { useEffect, useState } from 'react'
import LeftSideBar from '../components/LeftSideBar/LeftSideBar'
import Typography from '@mui/material/Typography'
import { Box, Grid, Button } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder';
import axios from 'axios';
import { toast } from 'react-toastify';


const Folder = ({ userId }) => {
    //Index prop defiend by according to this array
    //['dashboard', 'message', 'folder', 'data', 'privacy-policy', 'settings'];


    ///// Here we are store the all folder data
    const [folderDataStore ,  setFoldersData]  = useState([]);

    const colorsFolders = ["#7B2869", "#1A0000", "#58287F", "#0A2647", "#850000", "#FF597B", "#1C315E",
        "#FF6E31", "#227C70", "#2D033B"];

    const getRandomDigit = () => {
        return colorsFolders[Math.floor(Math.random() * 10)];
    }

    const folderGrid = (folderClr , folderObj) => {
        return <Grid py={{ xs: 2, md: 3 }} px={{ xs: 2, md: 4 }} item xs={6} sm={6} md={4} lg={3}>
            <Box py={{ xs: 3, md: 4 }}
                sx={{
                    backgroundColor: "#ffffff",
                    display: "grid", justifyItems: "center",
                    borderRadius: "8px",
                    border: `1.2px solid`, boxShadow: "0px 0px 2px 0px",
                    borderColor: folderClr,
                }}>
                <Box py={1} px={1.5}
                    sx={{ backgroundColor: folderClr, borderRadius: "10px" }}>
                    <FolderIcon sx={{ fontSize: '30px', color: "#ffffff" }} />
                </Box>
                <Typography variant="subtitle1" mt={1}
                    sx={{ fontSize: "12px", fontWeight: "700", color: "#333333" }} >{folderObj.folderName}</Typography>
                <Typography variant="body1"
                    sx={{ fontSize: "11px", fontWeight: "700", opacity: "0.9", color: "#333333" }}>{folderObj.filesList.length !== 0 ? `(${folderObj.filesList.length})` : "(0)" }</Typography>
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

            const response = await axios.post('http://localhost:8000/api/createFolder', folderData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.statusText === "OK") {
                const folderResponse = response.data;
                if (folderResponse.status) {
                    toast.success(folderResponse.message);
                    getFoldersData(userId);
                } else {
                    toast.error(folderResponse.message);
                }
            } else {
                toast.error("Something is wrong");
            }
        }
    }

    /////////////// get the folder data here  /////
    const getFoldersData = async(userId)=>{
        const userID = {userId:userId}
        const response = await axios.post('http://localhost:8000/api/getFolders', userID, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.statusText === "OK") {
            const folderResponse = response.data;
            if (folderResponse.status) {
                const foldersData = folderResponse.data;
                setFoldersData(foldersData)
            } else {
                toast.error(folderResponse.message);
            }
        } else {
            toast.error("Something is wrong");
        }
    }
    useEffect(()=>{
        getFoldersData(userId);
    },[])





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
                        folderDataStore.map((FolDataObj) => folderGrid(getRandomDigit() , FolDataObj))
                    }


                </Grid>
            </LeftSideBar>
        </>
    )
}

export default Folder