import React from 'react'
import LeftSideBar from '../components/LeftSideBar/LeftSideBar'
import NewMessageGrid from '../components/NewMessageGrid/NewMessageGrid'

const MyMessage = () => {
    return (
        <>
            <LeftSideBar data={{ pageName: "Message", index: 1 }}>
                <NewMessageGrid />
            </LeftSideBar>
        </>
    )
}

export default MyMessage