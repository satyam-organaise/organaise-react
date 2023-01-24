import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography, TextField } from '@mui/material';
import Papa from "papaparse";
import React, { useCallback, useState } from 'react'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useMutation } from 'react-query';
import { SignUpOtpVarify } from "../../api/CognitoApi/CognitoApi";
import { toast } from 'react-toastify';

const OtpVerificationModel = ({ handleClose, open, userName }) => {

    /////// Model width
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('xs');

    /////// Otp store state
    const [getOtp, setOtp] = useState("");

    //////// call api for otpverification
    const { mutateAsync: SignUpOtpVerification, isLoading: isLoadingSignUpOtp } = useMutation(SignUpOtpVarify);

    const otpVerificationFun = async (userName, GetOtpPrompt) => {
        const otpResponse = await SignUpOtpVerification({ username: userName, userOtp: GetOtpPrompt });
        if (otpResponse.status) {
            toast.success("Opt varifyed successfullly");
            handleClose("");
        } else {
            toast.error(otpResponse.error.message);
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
                        <Typography variant="subtitle2" color="#333333">Please enter OTP</Typography>
                        <ClearOutlinedIcon sx={{ cursor: "pointer", color: "#333333" }}
                            onClick={() => handleClose("Your otp not verifyed.")}
                        />
                    </Box>

                </DialogTitle>
                <DialogContent>
                    <TextField
                        id="otp_get"
                        label=""
                        value={getOtp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Box mt={3} sx={{ display: "flex", justifyContent: "center" }}>
                        <Button sx={{
                            paddingLeft: "50px", paddingRight: '50px',
                            backgroundColor: "#03CF80", textTransform: "capitalize"
                        }}
                            size='large'
                            variant='contained'
                            onClick={() => otpVerificationFun(userName, getOtp)}
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