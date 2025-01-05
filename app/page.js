"use client";
import { useContext, useEffect, useState } from "react";
import { RoomContext } from "@/context/roomContext";
import Peer from "peerjs";
import { v4 as uuid4 } from "uuid";
import VideoPlayer from "@/components/VideoPlayer";
import { metadata } from "./layout";

export default function Home() {
    const { io } = useContext(RoomContext);
    const [roomId, setRoomId] = useState(null);

    const [localPeer, setLocalPeer] = useState(null);

    const [localScreenSharePeer, setLocalScreenSharePeer] = useState(null);

    const [inputRoomId, setInputRoomId] = useState(null);
    const [remoteMembers, setRemoteMembers] = useState({});
    const [localStream, setLocalStream] = useState(null);

    const handelJoin = ({ roomId }) => {
        if (localPeer) {
            try {
                inputRoomId
                    ? io.emit("join-room", {
                          roomId: inputRoomId,
                          peerId: localPeer._id,
                      })
                    : io.emit("join-room", { roomId, peerId: localPeer._id });
            } catch (e) {
                console.log(e);
            }
        }
    };

    const hadelCreateRoom = () => {
        io.emit("create-room");
    };

    const handelInput = ({ value }) => {
        setInputRoomId(value);
    };

    useEffect(() => {
        io.on("room-cretaed", (data) => {
            setRoomId(data.roomId);
        });

        io.on("error", (error) => {
            console.log("error at socket:", error);
        });

        // replace this firebase uid
        const myId = uuid4();
        const peer = new Peer(myId);

        // Setting up the local peer
        setLocalPeer(peer);

        // setting up the screen share peer
        const screenSharePeer = new Peer(`${myId}-screen-share`);
        setLocalScreenSharePeer(screenSharePeer);
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true,
                });

                setLocalStream(stream);
            } catch (e) {
                console.log("error at getting media: ", e);
            }
        })();
    }, [localPeer]);

    // Handle screen share
    const startScreenShare = async () => {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
        });

        

        // Share screen with all the remote members
        Object.keys(remoteMembers).forEach((peerId) => {
            try {
                const call = localScreenSharePeer.call(peerId, screenStream);
                call.on("error", (err) => {
                    console.error(
                        `Error during screen share call with ${peerId}:`,
                        err
                    );
                });
            } catch (err) {
                console.error(
                    `Failed to call ${peerId} for screen sharing:`,
                    err
                );
            }
        });
    };

    useEffect(() => {
        if (localStream) {
            io.on("user-joined", ({ peerId }) => {
                if (localPeer) {
                    const call = localPeer.call(
                        peerId, 
                        localStream,
                    );
                    call.on("stream", (peerStream) => {
                        setRemoteMembers((prevState) => ({
                            ...prevState,
                            [peerId]: peerStream,
                        }));
                    });
                }
            });
        }

        if (localPeer) {
            localPeer.on("call", (call) => {
                call.answer(localStream);

                call.on("stream", (peerStream) => {
                    setRemoteMembers((prevState) => ({
                        ...prevState,
                        [call.peer]: peerStream,
                    }));
                });
            });
        }

        io.on("user-disconnected", ({ peerId }) => {
            setRemoteMembers((prevState) => {
                const newState = { ...prevState };
                delete newState[peerId];
                return newState;
            });
        });
    }, [localPeer, localStream]);

    return (
        <>
            <div>roomID {roomId}</div>
            <input
                type="text"
                onChange={(e) => handelInput({ value: e.target.value })}
            />
            <button onClick={hadelCreateRoom}>Create Room</button>
            <button onClick={() => handelJoin({ roomId })}>Join Room</button>
            <button onClick={startScreenShare}>Share Screen</button>

            {/* Video interface */}
            {localStream && <VideoPlayer stream={localStream} muted />}
            {Object.keys(remoteMembers).map((peerId, index) => (
                <VideoPlayer key={index} stream={remoteMembers[peerId]} />
            ))}
        </>
    );
}
