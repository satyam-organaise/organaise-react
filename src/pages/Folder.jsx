import React from 'react'
import LeftSideBar from '../components/LeftSideBar/LeftSideBar'
import Typography from '@mui/material/Typography'
import { Box, Grid } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder';


const Folder = () => {
    //Index prop defiend by according to this array
    //['dashboard', 'message', 'folder', 'data', 'privacy-policy', 'settings'];

    const colorsFolders = ["#7B2869", "#1A0000", "#58287F", "#0A2647", "#850000", "#FF597B", "#1C315E",
        "#FF6E31", "#227C70", "#2D033B"];

    const getRandomDigit = () => {
        return colorsFolders[Math.floor(Math.random() * 10)];
    }

    const folderGrid = (folderClr) => {
        return <Grid py={{xs:2, md: 3 }} px={{xs:2, md: 4 }} item xs={6} sm={6} md={4} lg={3}>
            <Box py={{xs:3, md: 4 }}
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
                    sx={{ fontSize: "12px", fontWeight: "700", color: "#333333" }} >Folder name</Typography>
                <Typography variant="body1"
                    sx={{ fontSize: "11px", fontWeight: "700", opacity: "0.9", color: "#333333" }}>(10 files)</Typography>
            </Box>
        </Grid>
    }


    return (
        <>
            <LeftSideBar data={{ pageName: "Folder", index: 2 }}>
                <Grid container spacing={1}>
                    {
                        [1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((d) => folderGrid(getRandomDigit()))
                    }


                </Grid>
            </LeftSideBar>
        </>
    )
}

export default Folder