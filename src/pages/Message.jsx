
import React from 'react'
import LeftSideBar from '../components/LeftSideBar/LeftSideBar'
import Typography from '@mui/material/Typography'
import MessageGrid from '../components/MessageGrid/MessageGrid'
const Message = () => {
    //Index prop defiend by according to this array
    //['dashboard', 'message', 'folder', 'data', 'privacy-policy', 'settings'];

    return (
        <>
            <LeftSideBar data={{ pageName: "Message", index: 1 }}>
               <MessageGrid  />
            </LeftSideBar>
        </>
    )
}

export default Message