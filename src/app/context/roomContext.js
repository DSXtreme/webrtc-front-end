"use client"
import { Children, createContext, useEffect } from "react"
import socketIoClient from "socket.io-client"


export const RoomContext = createContext(null)


const io = socketIoClient("http://localhost:3001")

const RoomProvider = ({children}) => {
   
  return (
    <RoomContext.Provider value={{io}}>
      {children}
    </RoomContext.Provider>
  )
}

export default RoomProvider

