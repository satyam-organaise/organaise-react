import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography, TextField } from '@mui/material';
import Papa from "papaparse";
import React, { useCallback, useState } from 'react'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useMutation } from 'react-query';
import { SignUpOtpVarify, otpWithResetPassword, userSignIn } from "../../api/CognitoApi/CognitoApi";
import { toast } from 'react-toastify';

const OtpVerificationModel = ({ handleClose, open, userName, serviceType = "", password = "" }) => {

    /////// Model width
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('xs');


    const [getOtp, setOtp] = useState(""); /////// Otp store state
    const [newPassword, setNewPassword] = useState(""); /////// set new password
    //////// call api for otpverification
    const { mutateAsync: SignUpOtpVerification, isLoading: isLoadingSignUpOtp } = useMutation(SignUpOtpVarify);
    //////// change password api call
    const { mutateAsync: updatePasswordWithOtp, isLoading: isLoadingWithUpdatePassword } = useMutation(otpWithResetPassword);
    ////////Here we are write the calling api function
    const { mutateAsync: loginApiCall, isLoading: loginApiIsLoading } = useMutation(userSignIn);
    const otpVerificationFun = async (userName, GetOtpPrompt, newPassword, serviceType) => {
        if (serviceType === "forgetPassword") {
            const updatePassword = await updatePasswordWithOtp({ username: userName, otp: GetOtpPrompt, password: newPassword });
            if (updatePassword.status) {
                toast.success("Password update successfullly");
                handleClose("");
            } else {
                toast.error(updatePassword.error.message);
            }
        } else {
            const otpResponse = await SignUpOtpVerification({ username: userName, userOtp: GetOtpPrompt });
            if (otpResponse.status) {
                const response = await loginApiCall({ username: userName, password: password });
                if (response.status) {
                    toast.success("OTP verified successfully.Please wait we are setup your account.");
                    setTimeout(async () => {
                        localStorage.clear();
                        const AgainLoginresponse = await loginApiCall({ username: userName, password: password });
                        if (AgainLoginresponse.status) {
                            handleClose("");
                            setTimeout(() => {
                                window.location = "/";
                            }, [1000])
                        }
                    }, [1000])
                }
            } else {
                toast.error(otpResponse.error.message);
            }
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
                        <Typography variant="subtitle2" color="#333333">
                            {serviceType === "forgetPassword" ? "Please enter otp and new password" : "Please enter OTP"}
                        </Typography>
                        <ClearOutlinedIcon sx={{ cursor: "pointer", color: "#333333" }}
                            onClick={() => handleClose("Your otp not verifyed.")}
                        />
                    </Box>

                </DialogTitle>
                <DialogContent>
                    <TextField
                        sx={{ marginTop: "16px" }}
                        id="otp_get"
                        label="OTP"
                        value={getOtp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <br />
                    {serviceType === "forgetPassword" &&
                        <TextField
                            sx={{ marginTop: "16px" }}
                            id="new_password"
                            label="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    }
                </DialogContent>
                <DialogActions>
                    <Box mt={3} sx={{ display: "flex", justifyContent: "center" }}>
                        <Button sx={{
                            paddingLeft: "50px", paddingRight: '50px',
                            backgroundColor: "#03CF80", textTransform: "capitalize"
                        }}
                            size='large'
                            variant='contained'
                            onClick={() => otpVerificationFun(
                                userName,
                                getOtp,
                                serviceType === "forgetPassword" ? newPassword : "",
                                serviceType === "forgetPassword" ? "forgetPassword" : ""
                            )
                            }
                            disabled={isLoadingSignUpOtp}
                        >
                            Verify
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default OtpVerificationModel