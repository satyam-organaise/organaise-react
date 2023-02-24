import { Box, Grid, Typography, TextField, Button } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useState } from 'react';
import { CognitoSignUp } from "../api/CognitoApi/CognitoApi";
import { useMutation } from "react-query";
import { toast } from 'react-toastify';
import OtpVerificationModel from '../components/OtpVerificationModel/OtpVerificationModel';
const SignUp = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    //////// open model for otp verification
    const [ModelState, setModelState] = useState(false);


    ///////// Api call by react query
    const { mutateAsync: SignUpFunCall, isLoading: isLoadingSignUpFun } = useMutation(CognitoSignUp);

    ////////// when click on the sign up button
    const createAccount = async () => {
        const userName = email.split('@')[0];
        const userEmail = email;
        const userPassword = password;
        const response = await SignUpFunCall({ username: userName, email: userEmail, password: userPassword })
        if (response.status && response.data.userSub) {
            toast.info("Please check your inbox");
            setModelState(true);
        } else {
            toast.error(response.error.message);
        }
    }

    const otpvrifyModleClose = (message) => {
        setModelState(false);
        if (message !== "") {
            toast.error(message);
        }
    }

    return (
        <>
            <Box width={"100%"} height="60px" bgcolor={"#3370FD"}>
                <Typography pl={5} pt={2} variant="subtitle2" sx={{ color: "#ffffff" }}>Organaise</Typography>
            </Box>
            <Box width={"100%"} height="100%" bgcolor={"#3370FD"}>
                <Grid container id="heading_service">
                    <Grid item xs={12} display="flex" justifyContent={"center"}>
                        <Typography variant="h6" sx={{ textAlign: "center", color: "#ffffff" }}
                            width={{ xs: "70%", sm: "60", md: "40%", lg: "45%" }}>
                            Explore your data. Organaise your data.
                        </Typography>
                    </Grid>
                    <Grid mt={2} item xs={12} display="flex" justifyContent={"center"}>
                        <Typography variant="subtitle2" sx={{ textAlign: "center", color: "#ffffff" }}
                            width={{ xs: "70%", sm: "60", md: "40%", lg: "45%" }}>
                            Sign Up for free
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container mt={1.5} id="service_form" height={"500px"} display="flex" justifyContent={"center"}>
                    <Grid container item xs={12} sm={8} md={4} width="100%">
                        <Grid item my={1} px={5} width={"100%"}>
                            <Typography variant="body2" mb={.5} sx={{ color: "#ffffff" }} >Email  Address</Typography>
                            <TextField
                                size='small'
                                sx={{ width: "100%", backgroundColor: "#ffffff", borderRadius: "0px" }}
                                id="Email_address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Typography variant="body2" mt={2} mb={.5} sx={{ color: "#ffffff" }} >Password</Typography>
                            <TextField
                                size='small'
                                sx={{ width: "100%", backgroundColor: "#ffffff", borderRadius: "0px" }}
                                id="Password"
                                type={"password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Box id="my_dob_box" display={"inlinne-flex"}>
                                <Box id="dob_box" width={"50%"}>
                                    <Box display={"flex"} justifyContent="space-between">
                                        <Typography variant="body2" mt={2} mb={.5} sx={{ color: "#ffffff" }} >Birth year</Typography>
                                        <Typography variant="body2" pr={1} mt={2} mb={.5} sx={{ color: "#ffffff", fontSize: "10px", lineHeight: 2, }} >Why ?</Typography>
                                    </Box>
                                    <TextField
                                        size='small'
                                        sx={{ width: "98%", backgroundColor: "#ffffff", borderRadius: "0px" }}
                                        id="birth_date"

                                    //label="Email Address"
                                    //value={}
                                    //onChange={}
                                    />
                                </Box>
                                <Box id="zip_box" width={"50%"} pl={"2%"}>
                                    <Box display={"flex"} justifyContent="space-between">
                                        <Typography variant="body2" mt={2} mb={.5} sx={{ color: "#ffffff" }} >Zip Code</Typography>
                                        <Typography variant="body2" pr={1} mt={2} mb={.5} sx={{ color: "#ffffff", fontSize: "10px", lineHeight: 2, }} >Why ?</Typography>
                                    </Box>
                                    <TextField
                                        size='small'
                                        sx={{ width: "98%", backgroundColor: "#ffffff", borderRadius: "0px" }}
                                        id="birth_date"

                                    //label="Email Address"
                                    //value={}
                                    //onChange={}

                                    />
                                </Box>
                            </Box>
                            <Box id="my_gender_box" display={"inlinne-flex"}>
                                <Box id="gender_box" width={"100%"}>
                                    <Box display={"flex"} justifyContent="space-between">
                                        <Typography variant="body2" mt={2} mb={.5} sx={{ color: "#ffffff" }} >Birth year</Typography>
                                        <Typography variant="body2" mt={2} mb={.5} sx={{ color: "#ffffff", fontSize: "10px", lineHeight: 2, }} >Why ?</Typography>
                                    </Box>
                                    <Box>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue="male"
                                            name="radio-buttons-group"
                                            row
                                            sx={{ display: "flex", justifyContent: "space-between" }}
                                        >
                                            <FormControlLabel
                                                value="female"
                                                sx={{ color: "#ffffff", ".css-28nq2i-MuiTypography-root": { "fontSize": "13px" } }}
                                                control={
                                                    <Radio
                                                        sx={{
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: 18, color: "#fff"
                                                            },
                                                        }}
                                                    />
                                                }
                                                label="Female"
                                            />
                                            <FormControlLabel
                                                value="male"
                                                sx={{ color: "#ffffff", ".css-28nq2i-MuiTypography-root": { "fontSize": "13px" } }}
                                                control={
                                                    <Radio
                                                        sx={{
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: 18, color: "#fff"
                                                            },
                                                        }}
                                                    />
                                                }
                                                label="Male"
                                            />
                                            <FormControlLabel
                                                value="Non-binary"
                                                sx={{ color: "#ffffff", ".css-28nq2i-MuiTypography-root": { "fontSize": "13px" } }}
                                                control={
                                                    <Radio
                                                        sx={{
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: 18, color: "#fff"
                                                            },
                                                        }}
                                                    />
                                                }

                                                label="Non-binary"
                                            />

                                        </RadioGroup>
                                    </Box>
                                </Box>

                            </Box>
                            <Button
                                variant='contained'
                                size='small'
                                sx={{ width: "100%", marginTop: "24px" }}
                                onClick={() => createAccount()}
                                disabled={isLoadingSignUpFun}
                            >
                                Sign Up
                            </Button>
                            <Box mt={2} px={"15%"} sx={{ display: "flex", justifyContent: "center" }} >
                                <Typography align='center' variant="body2" sx={{ fontSize: "12px", opacity: 0.8 }} color="#fff">   By signing up.you accept and agree to
                                    Pandora’s Terms of Use and Privacy Policy</Typography>
                            </Box>
                            <Box mt={2} sx={{ display: "flex", justifyContent: "center" }} >
                                <Typography align='center' variant="body2" sx={{ fontSize: "13px" }} color="#fff">Already have a Organaise account? </Typography>
                            </Box>
                            <Box mt={2} sx={{ display: "flex", justifyContent: "center" }} >
                                <Link to="/login" style={{
                                    color: "#fff", fontFamily: "Nunito", fontSize: "14px",
                                    textAlign: "center"
                                }}>Log In</Link>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            {ModelState && <OtpVerificationModel
                handleClose={otpvrifyModleClose}
                open={ModelState}
                userName={email.split('@')[0]}
                password={password}
            />}
        </>
    )
}

export default SignUp