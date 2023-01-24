import React from 'react'
import LeftSideBar from '../components/LeftSideBar/LeftSideBar'
import Typography from '@mui/material/Typography'

const Setting = () => {
    //Index prop defiend by according to this array
    //['dashboard', 'message', 'folder', 'data', 'privacy-policy', 'settings'];

    return (
        <>
            <LeftSideBar data={{ pageName: "Setting", index: 5 }}>
                <Typography variant="h1" color="secondary.dark">Setting</Typography>
            </LeftSideBar>
        </>
    )
}

export default Setting