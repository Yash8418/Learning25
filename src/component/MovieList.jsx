import React from 'react'
import { Link, useParams } from 'react-router-dom'

export const MovieList = () => {
    const id=useParams().id

  return (
    <div>
           <ul>
          <li>
            <Link to="/play/101">D Day</Link>
          </li>
          <li>
            <Link to="/play/102">TMKOC</Link>
          </li>
          <li>
            <Link to="/play/103">Holiday</Link>
          </li>
        </ul>
    </div>
  )
}
