import { Box, Grid, Typography, TextField, Button } from '@mui/material'
import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

import organaiseLogo from "../assets/Logo/organaise-logo.png";

const CompanyDetails = () => {

    const [companyName, setCompanyName] = useState("");

    /////// Create company function call
    const createCompany = async () => {
        if ((companyName.trim() === "") || (companyName.length === 0)) {
            toast.info("Please enter company name");
            return;
        }
        const UserId = JSON.parse(localStorage.getItem("UserData")).sub;
        const response = await axios.post('https://devorganaise.com/api/createCompany',
            { userId: UserId, companyName: companyName },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if (response.statusText === "OK") {
            if (response.data.status) {
                toast.success(response.data.message);
                setTimeout(() => {
                    window.location = "/";
                }, [500])
            } else {
                toast.error("Something is wrong");
            }
        } else {
            toast.error("Something is wrong");
        }
    }

    return (
        <>
            <Box container sx={{ width: "100%", minHeight: "600px", backgroundColor: "#ffffff" }}>
                <Grid container >
                    <Grid id="logoPartHere" mt={7} container item sx={12}>
                        <Box pl={{ xs: "1%", md: "10%" }}>
                            <img src={organaiseLogo} style={{ width: "150px" }} alt="organaise-logo-login-page" />
                        </Box>
                    </Grid>
                </Grid>
                <Grid container mt={7}>
                    <Grid container display={{ xs: "none", md: "block" }} md={3} item></Grid>
                    <Grid container item xs={12} md={6} >
                        <Box container mt={2} width={"100%"}>
                            <Typography textAlign={'center'} variant="h4" fontWeight={"600"}>Please enter your Company name</Typography>
                        </Box>
                        <Box container mt={2} width={"100%"}>
                            <Typography textAlign={'center'} variant="subtitle1" fontWeight={"600"}>
                                This will be the name of your workspace
                            </Typography>
                        </Box>
                        <Box container mt={4} width={"100%"} display="flex" justifyContent={"center"}>
                            <TextField
                                id="company_name_here"
                                label="Company name"
                                placeholder='Please enter company name'
                                size='medium'
                                sx={{ width: "75%" }}
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </Box>
                        <Box container mt={4} width={"100%"} display="flex" justifyContent={"center"}>
                            <Button
                                variant='contained'
                                sx={{ width: "75%", paddingTop: "10px", paddingBottom: "10pxsss" }}
                                onClick={() => createCompany()}
                            >
                                Create company
                            </Button>
                        </Box>
                    </Grid>
                    <Grid container item display={{ xs: "none", md: "block" }} md={3} ></Grid>
                </Grid>
            </Box>
        </>
    )
}

export default CompanyDetails