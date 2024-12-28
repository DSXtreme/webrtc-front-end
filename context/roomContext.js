"use client";
import { createContext, useEffect } from "react";
import socketIoClient from "socket.io-client";

export const RoomContext = createContext(null);

let io;
try {
    io = socketIoClient(process.env.NEXT_PUBLIC_API_URL);
} catch (error) {
    console.error("Error connecting to socket:", error);
}
// const io = socketIoClient("http://localhost:3001");/
// const io = socketIoClient("https://webrtc-backend-mdce.onrender.com");

const RoomProvider = ({ children }) => {
    useEffect(() => {
        console.log("connecting");
        return () => {
            console.log("disconnecting");
            // io.disconnect()
            // if (io) {
            //     io.disconnect();
            // }
        };
    }, []);

    return (
        <RoomContext.Provider value={{ io }}>{children}</RoomContext.Provider>
    );
};

export default RoomProvider;
