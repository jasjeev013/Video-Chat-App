import React, { useEffect,useCallback,useState } from 'react'
import ReactPlayer from 'react-player'
import { useSocket } from '../providers/Socket'
import { usePeer } from '../providers/Peer'

function Room() {
    const { socket } = useSocket()
    const { peer,createOffer,createAnswer,setRemoteAns,sendStream,remoteStream } = usePeer()

    const [myStream, setMyStream] = useState(null);
    const [remoteEmailId, setRemoteEmailId] = useState(null);

    const handleNewUserJoined =useCallback( async ({ emailId }) => {
        console.log(`${emailId} joined room`);
        const offer = await createOffer();
        socket.emit('call-user', { emailId, offer });
        setRemoteEmailId(emailId);

    },[createOffer,socket])

    const handleIncomingCall = useCallback(async ({ from, offer }) => {
        console.log(`${from} is calling you`);
        const ans = await createAnswer(offer);
        socket.emit('call-accepted',{emailId:from,ans});
        setRemoteEmailId(from)
    },[createAnswer,socket]);

    
    const handleCallAccepted = useCallback(async ({ ans }) => {
        console.log('Call accepted: ',ans);
        await setRemoteAns(ans);
        

    },[setRemoteAns]);

    const getUserMediaStream = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMyStream(stream);

    },[])

    const handleNegotiationNeededEvent = useCallback(async () => {
        const localOffer = peer.createOffer();
        socket.emit('call-user',{emailId:remoteEmailId,offer:localOffer});
    },[peer,remoteEmailId,socket])


    useEffect(() => {
        socket.on('user-joined',handleNewUserJoined);
        socket.on('incoming-call',handleIncomingCall);
        socket.on('call-accepted',handleCallAccepted);

        // return () => {
        //     socket.off('user-joined',handleNewUserJoined);
        //     socket.off('incoming-call',handleIncomingCall);
        //     socket.off('call-accepted',handleCallAccepted);
        // }
    },[handleCallAccepted,handleNewUserJoined,handleIncomingCall,socket])

    useEffect(() => {
    
            peer.addEventListener('negotiationneeded',handleNegotiationNeededEvent)
            return () => peer.removeEventListener('negotiationneeded',handleNegotiationNeededEvent)
    },[handleNegotiationNeededEvent,peer])

    useEffect(() => {
        getUserMediaStream();
    },[getUserMediaStream])

    return (
        <div className='room-page-container'>
            <h1>Room Page</h1>
            <h4>You are connected to {remoteEmailId}</h4>
            <button onClick={e => sendStream(myStream)}>Send My Video</button>
            <ReactPlayer url={myStream} playing={true} controls={true} width='50%' height='50%'/>
            <ReactPlayer url={remoteStream} playing={true} controls={true} width='50%' height='50%'/>

        </div>
    )
}

export default Room
