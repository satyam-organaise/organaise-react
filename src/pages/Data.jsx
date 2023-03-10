import React, { useState } from 'react';
import LeftSideBar from '../components/LeftSideBar/LeftSideBar';
import CircularProgressBar from '../components/DataPageComponent/CircularProgressBar/CircularProgressBar';
import LineBarsChart from '../components/DataPageComponent/LineBarsChart';
import FileUploadModal from '../components/FileUploadModal/FileUploadModal';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Grid, Typography } from '@mui/material/';
import FolderIcon from '@mui/icons-material/Folder';


const Data = ({ theme , userId}) => {
    //Index prop defiend by according to this array
    //['dashboard', 'message', 'folder', 'data', 'privacy-policy', 'settings'];
    const [open, setOpen] = useState(false);
    const [jsonData, setJsonData] = useState([]);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    const RandomColors = [
        "#5454D4",
        "#03CF80",
        "#ff9800",
        "#e91e63",
        "#4caf50",
        "#f44336",
        "#F36760",
        "#333333",

    ];

    const getRandomDigit = () => {
        return Math.floor(Math.random() * (7 - 0 + 1) + 0);
    }


    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
        createData('Potato', 3516, 12.0, 9, 3),
    ];


    return (
        <>
            <LeftSideBar data={{ pageName: "Data", index: 3 }} setOpen={setOpen}>
                <Grid container id="graph_session_in_data_part">
                    <Grid item py={.5} px={.7} md={3} lg={3} sx={{ height: "200px" }} >
                        <Box p={.5} bgcolor="#fff" borderRadius="10px">
                            <CircularProgressBar />
                            <Typography mt={.5} color="secondary.dark" variant="subtitle2" textAlign={'center'} > Total data - 1000</Typography>
                        </Box>
                    </Grid>
                    <Grid item py={.5} px={.7} md={9} lg={9} sx={{ height: "200px" }} >
                        <Box p={.5} bgcolor="#fff" borderRadius="10px">
                            <LineBarsChart />
                        </Box>
                    </Grid>
                </Grid>
                <Grid container spacing={1} id="table_and_folder_container">
                    <Grid item py={.5} px={.7} md={8} lg={9}>
                        <Box pl={.5} pt={1} sx={{ borderTopLeftRadius: "4px", borderTopRightRadius: "4px" }} bgcolor="#ffffff">
                            <Typography variant="subtitle2" pl={1.5} fontWeight={700} color="secondary.dark">Data List</Typography>
                        </Box>
                        <TableContainer component={Paper} sx={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px", boxShadow: "none" }}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ paddingTop: "2px", paddingBottom: "2px", fontSize: "12px", "fontWeight": "600", opacity: "0.8" }}
                                            component="th">Dessert (100g serving)</TableCell>
                                        <TableCell align="center" component="th" sx={{ fontSize: "12px", "fontWeight": "600", opacity: "0.8" }}>Calories</TableCell>
                                        <TableCell align="center" component="th" sx={{ fontSize: "12px", "fontWeight": "600", opacity: "0.8" }}>Fat&nbsp;(g)</TableCell>
                                        <TableCell align="center" component="th" sx={{ fontSize: "12px", "fontWeight": "600", opacity: "0.8" }}>Carbs&nbsp;(g)</TableCell>
                                        <TableCell align="center" component="th" sx={{ fontSize: "12px", "fontWeight": "600", opacity: "0.8" }}>Protein&nbsp;(g)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.name}

                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell sx={{ paddingTop: "10px", paddingBottom: "10px" }} component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="center">{row.calories}</TableCell>
                                            <TableCell align="center">{row.fat}</TableCell>
                                            <TableCell align="center">{row.carbs}</TableCell>
                                            <TableCell align="center">{row.protein}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item py={.5} px={.7} md={4} lg={3}>
                        <Grid container mt={0} borderRadius="5px" bgcolor="#ffffff">
                            <Grid container pl={2} pt={1}>
                                <Typography variant="subtitle2" sx={{ fontSize: "14px", fontWeight: "600" }} >Recent Folders</Typography>

                            </Grid>
                            {
                                [1, 2, 3, 4, 5, 6].map((d) =>
                                    <Grid item xs={6} p={1.4} display="flex" justifyContent={'center'}>
                                        <Box
                                            sx={{
                                                backgroundColor: RandomColors[getRandomDigit()],
                                                display: "grid", justifyItems: "center", padding: "5px",
                                                borderRadius: "8px"
                                            }}>
                                            <FolderIcon sx={{ fontSize: '30px', color: "#ffffff" }} />
                                            <Typography variant="subtitle2" sx={{ fontSize: "11px", fontWeight: "700", color: "#fff" }} >Folder name</Typography>
                                            <Typography variant="body2" sx={{ fontSize: "10px", fontWeight: "700", opacity: "0.9", color: "#fff" }}>(10 files)</Typography>
                                        </Box>
                                    </Grid>


                                )

                            }



                        </Grid>
                    </Grid>
                </Grid>

                {
                    open && <FileUploadModal open={open} handleClose={handleClose} userId={userId} setJsonData={setJsonData} />
                }
            </LeftSideBar>
        </>
    )
}

export default Data