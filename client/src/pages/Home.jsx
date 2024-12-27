import React from 'react'

function Home() {
  return (
    <div className='homepage-container'>
      <div className='input-container'>
        <input type="email" placeholder='Enter your email' />
        <input type="text"  placeholder='Enter Room Code'/>
        <button>Enter Room</button>
      </div>
    </div>
  )
}

export default Home
