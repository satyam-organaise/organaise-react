import { Box, Grid, Typography, TextField, Button, IconButton, InputAdornment, } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react'
import organaiseLogo from "../../assets/Logo/organaise-logo.png";
import loginPageBackgroundImg from "../../assets/BackgroundImages/loginBackGroundImg.png"
import forgetPassPageBGImg from "../../assets/BackgroundImages/forgetPasswordBgImg.png"
import signupPageBgImg from "../../assets/BackgroundImages/signupBackgroundImg.png"
import otpVerificationBgImg from "../../assets/BackgroundImages/otpVerificationBgImg.png"
import { Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import OtpField from 'react-otp-field';
import { toast } from 'react-toastify';
/////Import react query functions
import { useMutation } from 'react-query'
import { userSignIn, resendConfermationEMail, CognitoSignUp, SignUpOtpVarify } from "../../api/CognitoApi/CognitoApi";



const cssStyle = {
    parent_box: {
        width: "100%",
        maxWidth: "1200px",
        height: "100vh"
    },
    content_container_box: {
        backgroundColor: "#ffffff",
        padding: "10% 20%",
        minHeight: "500px",
        maxHeight: "100vh"
    },
    box_container_form: {
        margin: "10% 0%",
    },
    btn_textfield: {
        width: "100%",
        marginBottom: "5px",
        '& .MuiInputLabel-root': {
            color: '#377E3F', // default label color
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#377E3F' // default border color
            },
            '&:hover fieldset': {
                borderColor: '#377E3F' // border color on hover
            },
            '&.Mui-focused fieldset ': {
                borderColor: '#377E3F' // border color when focused
            },

        }
    },
    grid_textBox_button: {
        margin: "15px 0px"
    },
}

const LoginSignupVerifyForgetPassComponents = ({ serviceType }) => {

    const [showPassword, setShowPassword] = useState(false);
    const [OtpValue, setOtpValue] = useState('');////otp value store here
    const [showOtpVeriCont, setShowVeriCon] = useState(false);
    /////Store email address
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    /////// btn disabled until operation  not completed
    const [btnDisabed, setBtnDisabled] = useState(false);
    /////// Verify button disaabled until operation not complete
    const [verifyBtnDisable, setVerifyBtnDisabled] = useState(false);


    ////////Here we are write the calling api react query function and call the login fuction and resend  confermation mail
    const { mutateAsync: loginApiCall } = useMutation(userSignIn);
    const { mutateAsync: resendVerificationMail } = useMutation(resendConfermationEMail);
    const loginAccount = async (email, password) => {
        setBtnDisabled(true);
        const response = await loginApiCall({ username: email.split("@")[0], password: password });
        if (response.status) {
            toast.success("Login successfully");
            setTimeout(() => {
                setBtnDisabled(false);/////login , signup ,forget account btn disaabled after clicking
                window.location = "/";
            }, [1500])
        } else {
            ////////user account created but user account not activated//////
            if (response.error.message === "User is not confirmed.") {
                const mailApiRes = await resendVerificationMail({ username: email.split("@")[0] });
                if (mailApiRes.status) {
                    toast.info("Please check your mail inbox.");
                    setBtnDisabled(false);
                } else {
                    toast.error(mailApiRes.error.message);
                    setBtnDisabled(false);
                }
            } else {
                setBtnDisabled(false)
                toast.error(response.error.message);
            }
        }
    }

    ///////// when click on the signup button then code run 
    const { mutateAsync: SignUpFunCall, isLoading: isLoadingSignUpFun } = useMutation(CognitoSignUp);
    const createAccount = async (email,password) => {
        const userName = email.split('@')[0];
        const userEmail = email;
        const userPassword = password;
        const response = await SignUpFunCall({ username: userName, email: userEmail, password: userPassword })
        if (response.status && response.data.userSub) {
            toast.info("Please check your inbox");
            setShowVeriCon(true);
        } else {
            toast.error(response.error.message);
        }
    }


    ///////// Signup otp verification/////////
    const { mutateAsync: SignUpOtpVerification} = useMutation(SignUpOtpVarify);
    const signupVerificationOtp = async (email, getOtp) => {
        setVerifyBtnDisabled(true);
        const userName = email.split('@')[0];
        const otpResponse = await SignUpOtpVerification({ username: userName, userOtp: getOtp });
        if (otpResponse.status) {
            const response = await loginApiCall({ username: userName, password: password });
            if (response.status) {
                toast.success("OTP verified successfully.Please wait we are setup your account.");
                setTimeout(async () => {
                    localStorage.clear();
                    const AgainLoginresponse = await loginApiCall({ username: userName, password: password });
                    if (AgainLoginresponse.status) {
                        setVerifyBtnDisabled(false)
                        setTimeout(() => {
                            window.location = "/";
                        }, [1000])
                    }
                }, [1000])
            }
        } else {
            toast.error(otpResponse.error.message);
            setVerifyBtnDisabled(false);
        }
    }




    ///////Service type  change then useEffect Run
    useEffect(() => {
        setEmailAddress("");
        setPassword("");
        setConfirmPassword("");
    }, [serviceType])

    /////////// when clickk on the button Like -  login , signup , forget password
    const buttonAction = async(serviceType) => {
        if (serviceType === "login") {
            if (emailAddress === "" || password === "") {
                toast.error("Please fill all fields.")
                return null;
            }
            loginAccount(emailAddress, password);
        }

        if (serviceType === "signup") {
            if (emailAddress === "" || password === "" || confirmPassword === "") {
                toast.error("Please fill all fields.")
                return null;
            }
            if (password != confirmPassword) {
                toast.error("Password and confirm password not matched.")
                return null;
            }
            await createAccount(emailAddress , password);
        }

    }

    ////////// When click on the verify button
    const otpVerifyBtn = async (serviceType) => {
        if ((OtpValue == "") || (OtpValue.length != 6)) {
            toast.error("Please enter six digit OTP.");
            return null;
        }
        if (serviceType === "login") {

        }

        if (serviceType === "signup") {
            await signupVerificationOtp(emailAddress, OtpValue)
        }

    }



    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };


    const bgImgForLoginSignUpForgetVarify = (serviceType) => {
        switch (serviceType) {
            case "login":
                return <img src={loginPageBackgroundImg} style={{ width: "100%" }} alt="login-page-background-image" />
                break;
            case "signup":
                return <img src={signupPageBgImg} style={{ width: "100%" }} alt="signUp-page-background-image" />
                break;
            case "forgetPassword":
                return <img src={forgetPassPageBGImg} style={{ width: "100%" }} alt="forget-password-page-background-image" />
                break;
            case "verification":
                return <img src={otpVerificationBgImg} style={{ width: "100%" }} alt="login-page-background-image" />
                break;
            default:
                break;
        }
    }




    return (
        <Box container sx={cssStyle.parent_box}>
            <Grid container>
                <Grid item xs={12} sm={12} md={6}>
                    <Box container sx={{ ...cssStyle.content_container_box, padding: "10% 5% 10% 20% !important" }} >
                        <Box>
                            <img src={organaiseLogo} style={{ width: "150px" }} alt="organaise-logo-login-page" />
                        </Box>
                        <Box>
                            {showOtpVeriCont ? bgImgForLoginSignUpForgetVarify("verification") : bgImgForLoginSignUpForgetVarify(serviceType)}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    {!showOtpVeriCont &&
                        <Box container sx={cssStyle.content_container_box} >
                            <Box>
                                <Typography variant="h4" fontWeight='600' color="#333333">
                                    {serviceType === "login" && 'Get Started'}
                                    {serviceType === "signup" && 'Create Account'}
                                    {serviceType === "forgetPassword" && 'Forget Password?'}
                                </Typography>
                            </Box>
                            <Box sx={cssStyle.box_container_form}>
                                <Grid container>
                                    <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                        <TextField
                                            id="login-signup-forgetPassword-email"
                                            label="Email"
                                            variant='outlined'
                                            type="email"
                                            sx={cssStyle.btn_textfield}
                                            value={emailAddress ? emailAddress : ""}
                                            onChange={(e) => setEmailAddress(e?.target?.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                        <TextField
                                            id="login-signup-forgetPassword-password"
                                            label="Password"
                                            //type={showPassword ? 'text' : 'password'}
                                            type={'password'}
                                            variant='outlined'
                                            sx={cssStyle.btn_textfield}
                                            value={password ? password : ""}
                                            onChange={(e) => setPassword(e?.target?.value)}
                                        // InputProps={{
                                        //     endAdornment: (
                                        //         <InputAdornment position="end">
                                        //             <IconButton onClick={handleTogglePassword}>
                                        //                 {showPassword ? <VisibilityOff /> : <Visibility />}
                                        //             </IconButton>
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        />
                                        {/* When service type login then this link show otherwise not visible */}
                                        {
                                            serviceType === "login" &&
                                            <Typography variant="subtitle2" align='right'>
                                                <Link to="/forget-password" style={{ textDecoration: "none", color: "red" }}>
                                                    Forget Password?
                                                </Link>
                                            </Typography>

                                        }
                                    </Grid>
                                    {/* when service type is forget password then extra input box are show for conferm password */}
                                    {serviceType !== "login" &&
                                        <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                            <TextField
                                                id="login-signup-forgetPassword-confirm-password"
                                                label="Confirm Password"
                                                type={'password'}
                                                variant='outlined'
                                                sx={cssStyle.btn_textfield}
                                                value={confirmPassword ? confirmPassword : ""}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </Grid>
                                    }

                                    <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                ...cssStyle.btn_textfield,
                                                height: "50px", position: "relative",
                                                backgroundColor: "#225127e6",
                                                '&:hover': {
                                                    backgroundColor: '#377E3F' // background color on hover
                                                }
                                            }}
                                            disabled={btnDisabed || isLoadingSignUpFun}
                                            onClick={() => buttonAction(serviceType)}

                                        >
                                            {(btnDisabed || isLoadingSignUpFun) && (
                                                <CircularProgress
                                                    size={24}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        right: '3%',
                                                        marginTop: -12,
                                                        marginLeft: -12,
                                                        color: "#225127e6"
                                                    }}
                                                />
                                            )}
                                            {serviceType === "login" && 'Login'}
                                            {serviceType === "signup" && 'Create Account'}
                                            {serviceType === "forgetPassword" && 'Send OTP'}

                                        </Button>

                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    }


                    {/* when click on the send  otp button then this container show */}
                    {showOtpVeriCont &&
                        <Box container sx={{ ...cssStyle.content_container_box, padding: "15% 20%" }} >
                            <Box>
                                <Typography variant="h4" align='center' fontWeight='600' color="#333333">
                                    OTP verification
                                </Typography>
                                <Typography variant="subtitle1" align='center' fontWeight='400' color="#333333">
                                    We’ve sent a code to {emailAddress}
                                </Typography>
                            </Box>
                            <Box sx={cssStyle.box_container_form}>
                                <Grid container>
                                    <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                        <OtpField
                                            value={OtpValue}
                                            onChange={setOtpValue}
                                            numInputs={6}
                                            onChangeRegex={/^([0-9]{0,})$/}
                                            autoFocus
                                            // separator={<span>-</span>}
                                            isTypeNumber
                                            inputProps={{
                                                className: `otp-field__input`,
                                                disabled: false,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                        <Typography variant="subtitle1" align='center' fontWeight='400' color="#333333">
                                            Didn’t receive OTP? <span style={{ fontWeight: 700, color: "#225127e6" }}>Resend</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sx={cssStyle.grid_textBox_button}>
                                        <Button variant="contained"
                                            sx={{
                                                ...cssStyle.btn_textfield,
                                                height: "50px",position:"relative",
                                                backgroundColor: "#225127e6",
                                                '&:hover': {
                                                    backgroundColor: '#377E3F' // background color on hover
                                                }
                                            }}
                                            disabled={verifyBtnDisable}
                                            onClick={() => otpVerifyBtn(serviceType)}
                                        >   
                                        
                                        {verifyBtnDisable && (
                                                <CircularProgress
                                                    size={24}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        right: '3%',
                                                        marginTop: -12,
                                                        marginLeft: -12,
                                                        color: "#225127e6"
                                                    }}
                                                />
                                            )}
                                            Verify OTP
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    }

                </Grid>
            </Grid>
        </Box>
    )
}

export default LoginSignupVerifyForgetPassComponents