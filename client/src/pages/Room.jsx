import React, { useEffect } from 'react'
import { useSocket } from '../providers/Socket'

function Room() {
    const { socket } = useSocket()
    const handleNewUserJoined = ({ emailId }) => {
        console.log('User joined room', emailId);
    }
    useEffect(() => {
        socket.on('user-joined',handleNewUserJoined)
    },[socket])

    return (
        <div className='room-page-container'>
            <h1>Room Page</h1>
        </div>
    )
}

export default Room
