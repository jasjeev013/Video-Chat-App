import React, { useEffect,useCallback } from 'react'
import { useSocket } from '../providers/Socket'
import { usePeer } from '../providers/Peer'

function Room() {
    const { socket } = useSocket()
    const { peer,createOffer,createAnswer,setRemoteAns } = usePeer()

    const handleNewUserJoined =useCallback( async ({ emailId }) => {
        console.log(`${emailId} joined room`);
        const offer = await createOffer();
        socket.emit('call-user', { emailId, offer });

    },[createOffer,socket])

    const handleIncomingCall = useCallback(async ({ from, offer }) => {
        console.log(`${from} is calling you`);
        const ans = await createAnswer(offer);
        socket.emit('call-accepted',{emailId:from,ans});
    },[createAnswer,socket]);

    
    const handleCallAccepted = useCallback(async ({ ans }) => {
        console.log('Call accepted: ',ans);
        await setRemoteAns(ans);
    },[setRemoteAns]);


    useEffect(() => {
        socket.on('user-joined',handleNewUserJoined);
        socket.on('incoming-call',handleIncomingCall);
        socket.on('call-accepted',handleCallAccepted);

        return () => {
            socket.off('user-joined',handleNewUserJoined);
            socket.off('incoming-call',handleIncomingCall);
            socket.off('call-accepted',handleCallAccepted);
        }
    },[handleCallAccepted,handleNewUserJoined,handleIncomingCall,socket])

    return (
        <div className='room-page-container'>
            <h1>Room Page</h1>
        </div>
    )
}

export default Room
