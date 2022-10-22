import React, { useState, useEffect } from 'react'
import eventBus from '../../eventBus';
import { useLocation } from 'react-router-dom'

export default function Search() {
  const [song, setSongs] = useState([]);
  const [attribute, setAttribute] = useState("");
  const [condition, setCondition] = useState("");
  const [limit, setLimit] = useState(10);
  const location = useLocation();
  setAttribute(location.state.attribute);
  setCondition(location.state.condition)
  // const getSongs = async () => {
  //   try {
  //     const response = await fetch("")
  //   }
  // }
  return (
    <div>
      <h1>jldsnl</h1>
    </div>
  )
}
