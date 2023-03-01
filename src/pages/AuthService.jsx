import { Box } from '@mui/material'
import React from 'react'
import LoginSignupVerifyForgetPassComponents from '../components/LoginSignupVerifyForgetPass/LoginSignupVerifyForgetPassComponents'


const cssStyle = {
    main_box: {
        width: "100%",
        minHeight: "600px",
        backgroundColor: "#ffffff",
    },
}

const AuthService = ({ serviceType }) => {
    return (
        <Box sx={cssStyle.main_box} display="flex" justifyContent={'center'}>
            <LoginSignupVerifyForgetPassComponents serviceType={serviceType} />
        </Box>
    )
}

export default AuthService