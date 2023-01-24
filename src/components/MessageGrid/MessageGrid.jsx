import { Grid, Typography, Box, TextField, Avatar } from '@mui/material'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InputBase from '@mui/material/InputBase';
import NavigationIcon from '@mui/icons-material/Navigation';


const customScrollbar = {
    '&::-webkit-scrollbar': {
        width: '0.3em',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: "5px",
    },
    '&::-webkit-scrollbar-thumb': {
        borderRadius: '1em',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
}



const MessageGrid = () => {

    const [searchUser, setSearchUser] = useState("");


    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        // '&:hover': {
        //     backgroundColor: alpha(theme.palette.common.white, 0.25),
        // },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    }));


    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: '#000000',
        position: "absolute",
        width: "100%",
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            //paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            //transition: theme.transitions.create('width'),
            paddingRight: "70px",
            width: '100%',

            [theme.breakpoints.up('sm')]: {
                '&:focus': {
                    color: "#333333",
                },
            },
        },
    }));



    return (

        <Grid container spacing={1} >
            <Grid item md={3} px={1} sx={{ height: "510px" }}>
                <Box height={"100%"} px={1} py={1} borderRadius="8px" bgcolor={"#ffffff"}>
                    <Grid container>
                        <Typography mt={1} fontWeight="800" variant="subtitle2" color="secondary.dark" sx={{ opacity: "0.9" }}>Message</Typography>
                    </Grid>
                    <Grid container my={1.5}>
                        <TextField
                            size='small'
                            id="search_users_in_message_part"
                            label="Search"
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                        />
                    </Grid>
                    {
                        [1, 2, 3, 4, 5, 6].map((d) =>
                            <Grid py={.2} container mt={1}>
                                <Box>
                                    <Avatar alt="Remy Sharp" src="#" />
                                </Box>
                                <Box ml={1} pt={.6}>
                                    <Typography sx={{ padding: "0px !important", lineHeight: "1", fontSize: "14px", fontWeight: "700" }} variant="subtitle1" color="secondary.dark">Satyam</Typography>
                                    <Typography sx={{ fontSize: "11px", lineHeight: "1.5" }} variant="body2" color="secondary.dark">This is dummy text</Typography>
                                </Box>
                            </Grid>

                        )
                    }

                </Box>
            </Grid>
            <Grid item md={9} sx={{ height: "510px" }}>
                <Box height={"100%"} borderRadius="8px" sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }} bgcolor={"#ffffff"}>
                    <Grid
                        sx={{
                            borderBottom: "1px solid #333333",
                            borderBottomLeftRadius: "8px",
                            borderBottomRightRadius: "8px"
                        }}
                        pb={1}
                        pt={1.5}
                        pl={2}
                        display="flex"
                    >
                        <Box>
                            <Avatar alt="Remy Sharp" src="#" />
                        </Box>
                        <Box ml={1} pt={.6}>
                            <Typography sx={{ padding: "0px !important", lineHeight: "1", fontSize: "14px", fontWeight: "700" }} variant="subtitle1" color="secondary.dark">Satyam</Typography>
                            <Typography
                                sx={{ fontSize: "11px", lineHeight: "1.5" }}
                                variant="body2" color="secondary.dark">Active now</Typography>
                        </Box>
                    </Grid>
                    <Box container sx={customScrollbar} height="100%" pt={.5} position="relative" pb={.5} overflow="auto">
                        <Box container sx={{
                            paddingLeft: " 7px",
                            width: "100%", marginBottom: "7px", display: "flex", justifyContent: "left"
                        }} >
                            <Typography
                                variant="body2"
                                color="secondary.dark"
                                sx={{
                                    backgroundColor: "#FBFBFB",
                                    width: "60%",
                                    borderRadius: "5px",
                                    padding: "7px", opacity: 0.85, color: "#7A7A7A",
                                }}
                            >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi eligendi quod voluptatibus sapiente, quis fugit sed ipsum pariatur debitis totam saepe dolorem. Odio sed, ratione et nam ducimus harum fugiat.
                            </Typography>
                        </Box>
                        <Box container sx={{
                            paddingRight: " 7px",
                            width: "100%", marginBottom: "7px", display: "flex", justifyContent: "right"
                        }} >
                            <Typography
                                variant="body2"
                                color="secondary.dark"
                                sx={{
                                    backgroundColor: "#5454D3",
                                    width: "60%",
                                    borderRadius: "5px",
                                    padding: "7px",
                                    color: "#ffffff"

                                }}
                            >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi eligendi quod voluptatibus sapiente, quis fugit sed ipsum pariatur debitis totam saepe dolorem. Odio sed, ratione et nam ducimus harum fugiat.
                            </Typography>
                        </Box>
                        <Box container sx={{
                            paddingLeft: " 7px",
                            width: "100%", marginBottom: "7px", display: "flex", justifyContent: "left"
                        }} >
                            <Typography
                                variant="body2"
                                color="secondary.dark"
                                sx={{
                                    backgroundColor: "#FBFBFB",
                                    width: "60%",
                                    borderRadius: "5px",
                                    padding: "7px", opacity: 0.85, color: "#7A7A7A",
                                }}
                            >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi eligendi quod voluptatibus sapiente, quis fugit sed ipsum pariatur debitis totam saepe dolorem. Odio sed, ratione et nam ducimus harum fugiat.
                            </Typography>
                        </Box>
                        <Box container sx={{
                            paddingRight: " 7px",
                            width: "100%", marginBottom: "7px", display: "flex", justifyContent: "right"
                        }} >
                            <Typography
                                variant="body2"
                                color="secondary.dark"
                                sx={{
                                    backgroundColor: "#5454D3",
                                    width: "60%",
                                    borderRadius: "5px",
                                    padding: "7px",
                                    color: "#ffffff"

                                }}
                            >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi eligendi quod voluptatibus sapiente, quis fugit sed ipsum pariatur debitis totam saepe dolorem. Odio sed, ratione et nam ducimus harum fugiat.
                            </Typography>
                        </Box>
                    </Box>

                    <Grid pb={1} pt={1} pl={1} pr={1}>
                        <Box sx={{ border: "1px solid #efefef", borderRadius: "10px", height: "40px", boxShadow: "0px 0px 10px 4px #eae7e7" }}>
                            <Search>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                                <Box
                                    sx={{
                                        width: "50px",
                                        position: "absolute",
                                        right: "15px",
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }} id="send_message_but_and_add_file_icon">
                                    <Box
                                        sx={{
                                            padding: "4px",
                                            width: "30px",
                                            height: "30px",
                                            marginTop: "4px",
                                        }}
                                    >
                                        <AttachFileIcon sx={{ fontSize: "20px" }} />
                                    </Box>
                                    <Box
                                        sx={{
                                            backgroundColor: "#5454d4",
                                            padding: "4px",
                                            borderRadius: "50px",
                                            width: "30px",
                                            height: "30px",
                                            marginTop: "4px",
                                        }}
                                    >
                                        <NavigationIcon sx={{ transform: " rotate(90deg)", color: "#ffffff", fontSize: "22px" }} />
                                    </Box>


                                </Box>

                            </Search>

                        </Box>
                    </Grid>
                </Box>

            </Grid>
        </Grid>

    )
}

export default MessageGrid