"use client";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { RoomContext } from "./context/roomContext";

export default function Home() {
    const { io } = useContext(RoomContext);

    const [roomId, setRoomId] = useState(null);

    const handelJoin = ({roomId}) => {
		console.log("req to join with id: ", roomId)
        io.emit("join-room", {roomId});

    };

    const hadelCreateRoom = () => {
        io.emit("create-room");
    };

    useEffect(() => {
        io.on("room-cretaed", (data) => {
            console.log("data from room created: ", data);
			
			// Updating roomId
			setRoomId(data.roomId)
        });
    }, []);

    return (
        <>
            <button
                onClick={() => {
                    hadelCreateRoom();
                }}
            >
                Create Room
            </button>
            <button
                onClick={() => {
                    handelJoin({roomId});
                }}
            >
                join room
            </button>
        </>
    );
}
