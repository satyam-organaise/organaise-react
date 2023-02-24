import { Box, Grid, Typography, TextField, Button } from '@mui/material'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { userSignIn, resendConfermationEMail } from "../api/CognitoApi/CognitoApi";
import { toast } from 'react-toastify';

import OtpVerificationModel from '../components/OtpVerificationModel/OtpVerificationModel';



const Login = () => {

    const navigate = useNavigate();
    /////////// Here we defined the state for storing the email and password value
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    //////// open model for otp verification
    const [ModelState, setModelState] = useState(false);

    ////////Here we are write the calling api function
    const { mutateAsync: loginApiCall, isLoading: loginApiIsLoading } = useMutation(userSignIn);
    const { mutateAsync: resendVerificationMail } = useMutation(resendConfermationEMail);

    const loginAccount = async (email, password) => {
        const response = await loginApiCall({ username: email.split("@")[0], password: password });
        if (response.status) {
            toast.success("Login successfully");
            setTimeout(() => {
                window.location = "/";
            }, [1500])
        } else {
            if (response.error.message === "User is not confirmed.") {
                const mailApiRes = await resendVerificationMail({ username: email.split("@")[0] });
                if (mailApiRes.status) {
                    toast.info("Please check your mail inbox.");
                    setModelState(true);
                } else {
                    toast.error(mailApiRes.error.message);
                }
                console.log("mailApiRes", mailApiRes);
            } else {
                toast.error(response.error.message);
            }
        }
    }
    /////Otp  model close
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
                            Explore the new Organaise from the free stations you
                            love to add-free search and play.
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container mt={3} id="service_form" height={"460px"} display="flex" justifyContent={"center"}>
                    <Grid container item xs={12} sm={8} md={4} width="100%">
                        <Grid item my={3} px={5} width={"100%"}>
                            <Typography variant="body2" mb={.5} sx={{ color: "#ffffff" }} >Email</Typography>
                            <TextField
                                size='small'
                                sx={{ width: "100%", backgroundColor: "#ffffff", borderRadius: "0px" }}
                                id="Email_address"
                                //label="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}

                            />
                            <Typography variant="body2" mt={4} mb={.5} sx={{ color: "#ffffff" }} >Password</Typography>
                            <TextField
                                size='small'
                                sx={{ width: "100%", backgroundColor: "#ffffff", borderRadius: "0px" }}
                                id="Password"
                                //label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                variant='contained'
                                size='small'
                                sx={{ width: "100%", marginTop: "40px" }}
                                onClick={() => loginAccount(email, password)}
                                disabled={loginApiIsLoading}
                            >
                                Login
                            </Button>

                            <Box mt={5} sx={{ display: "flex", justifyContent: "center" }} >
                                <Link to="/forget-password" style={{
                                    color: "#fff", fontFamily: "Nunito",
                                    fontSize: "15px", textAlign: "center"
                                }}>Forget Password </Link>
                            </Box>
                            <Box mt={3} sx={{ display: "flex", justifyContent: "center" }} >

                                <Typography style={{
                                    color: "#fff", fontFamily: "Nunito", fontSize: "12px",
                                    textAlign: "center"
                                }} variant="subtitle2" color="initial">
                                    Don't have a Organaise account?
                                </Typography>
                            </Box>
                            <Box mt={2} sx={{ display: "flex", justifyContent: "center" }} >
                                <Link to="/signUp" style={{
                                    color: "#fff", fontFamily: "Nunito", fontSize: "12px",
                                    textAlign: "center"
                                }}>Sign Up</Link>
                            </Box>
                        </Grid>
                    </Grid>

                </Grid>
            </Box>
            {ModelState &&
                <OtpVerificationModel
                    handleClose={otpvrifyModleClose}
                    open={ModelState}
                    userName={email.split('@')[0]}
                />}

        </>
    )
}

export default Login