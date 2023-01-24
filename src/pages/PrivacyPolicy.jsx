import React from 'react'
import LeftSideBar from '../components/LeftSideBar/LeftSideBar'
import Typography from '@mui/material/Typography'

const PrivacyPolicy = () => {
    //Index prop defiend by according to this array
    //['dashboard', 'message', 'folder', 'data', 'privacy-policy', 'settings'];

    return (
        <>
            <LeftSideBar data={{ pageName: "Privacy Policy", index: 4 }}>
                <Typography variant="h1" color="secondary.dark">Privacy policy</Typography>
            </LeftSideBar>
        </>
    )
}

export default PrivacyPolicy