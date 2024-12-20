"use client";
import { createContext, useEffect } from "react";
import socketIoClient from "socket.io-client";

export const RoomContext = createContext(null);

const io = socketIoClient("http://localhost:3001");

const RoomProvider = ({ children }) => {

    useEffect(()=>{
        return () =>{
            io.disconnect()
        }
    },[])
	
    return (
        <RoomContext.Provider value={{ io }}>{children}</RoomContext.Provider>
    );
};

export default RoomProvider;
