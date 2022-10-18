import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'

export default function Home() {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currMusic, setCurrMusic] = useState(null);

  let pathname = window.location.pathname;
  // useEffect(() => {

  // })
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  )
}
