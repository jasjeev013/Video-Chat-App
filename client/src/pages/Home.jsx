import React,{useState,useEffect,useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSocket} from '../providers/Socket'

function Home() {
  const {socket } = useSocket()
  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [roomId, setRoomId] = useState();

  const handleRoomJoined = useCallback(({ roomId }) => {
    console.log('User joined room', roomId);
    navigate(`/room/${roomId}`);
  },[navigate])

  useEffect(() => {
    socket.on('joined-room',handleRoomJoined)

    return () => {
      socket.off('joined-room',handleRoomJoined)
    }
  },[handleRoomJoined,socket])

  const handleJoinRoom = () => {
    socket.emit('join-room', {roomId, emailId: email});
  }
  return (
    <div className='homepage-container'>
      <div className='input-container'>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Enter your email' />
        <input value={roomId} onChange={(e) => setRoomId(e.target.value)} type="text"  placeholder='Enter Room Code'/>
        <button onClick={handleJoinRoom}>Enter Room</button>
      </div>
    </div>
  )
}

export default Home
