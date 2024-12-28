"use client";
import {
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { RoomContext } from "@/context/roomContext";
import Peer from "peerjs";
import { v4 as uuid4 } from "uuid";
import VideoPlayer from "@/components/VideoPlayer";

export default function Home() {
    const { io } = useContext(RoomContext);

    const [roomId, setRoomId] = useState(null);
    const [localPeer, setLocalPeer] = useState(null);
    const [inputRoomId, setInputRoomId] = useState(null);
    /*
     *  remoteMembers: {peerId: stream}
     */
    const [remoteMembers, setRemoteMembers] = useState({});
    const [localStream, setLocalStream] = useState(null);

    // handeling join room
    const handelJoin = ({ roomId }) => {
        console.log("req to join with id: ", roomId);

        if (localPeer) {
            console.log("this is peer id form me: ", localPeer._id);

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

    // Request to create a room
    const hadelCreateRoom = () => {
        console.log("req to create room");
        io.emit("create-room");
    };

    // handelin input on change
    const handelInput = ({ value }) => {
        console.log("room id manual: ", value);
        setInputRoomId(value);
    };


    /**
     * Listening to
     * 1. room-create
     * 2. get-users
     * 3. error at socket
     *
     * Generating new peer for local users
     */
    useEffect(() => {
        // On room created
        io.on("room-cretaed", (data) => {
            console.log("data from room created: ", data);
            setRoomId(data.roomId);
        });
    

        // For any error at socket
        io.on("error", (error) => {
            console.log("error at socket:", error);
        });

        // Generating peer instance and assiginging id for the user
        const myId = uuid4();

        const peer = new Peer(myId);

        console.log("this is peer: ", peer);

        setLocalPeer(peer);
    }, []);

    /**
     *  Handeling audio and video stream
     */
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


    // handeling calls
    useEffect(() => {
        //calling user who have joined and passing the stream
        if (localStream) {
            try {
                io.on("user-joined", ({ peerId }) => {
                    console.log("remote join user", peerId);

                    if (localPeer) {
                       
                        const call = localPeer.call(peerId, localStream);

                        // While getting remote user stream assign to remote video
                        call.on("stream", (peerStream) => {
                            console.log("call peer call: ", { peerStream });
                            setRemoteMembers(prevState => ({
                                ...prevState,
                                [peerId]: peerStream,
                            }));
                            // remoteVideoRef.current.srcObject = peerStream;
                        });
                    }
                });
            } catch (e) {
                console.log(e);
            }
        }

        
        if (localPeer) {
            try {
                localPeer.on("call", (call) => {
                    console.log("call form remote: ", call);
                    call.answer(localStream);
                    call.on("stream", (peerStream) => {
                        console.log("peer stream: ", peerStream);
                        setRemoteMembers(prevState => ({
                            ...prevState,
                            [call.peer]: peerStream,
                        }));
                    });
                });
            } catch (e) {
                console.log("error at answering: ", e);
            }
        }

        io.on("user-disconnected", ({ peerId }) => {
            console.log("user disconnected", peerId);
            setRemoteMembers((prevState) => {
                const newState = { ...prevState };
                delete newState[peerId];
                return newState;
            });
        });


    }, [localPeer, localStream]);

    return (
        console.log("remoteMembers", remoteMembers),
        <>
            <div>roomID {roomId}</div>
            <input
                type="text"
                onChange={(e) => handelInput({ value: e.target.value })}
            />
            <button
                onClick={() => {
                    hadelCreateRoom();
                }}
            >
                Create Room
            </button>
            <button
                onClick={() => {
                    handelJoin({ roomId });
                }}
            >
                join room
            </button>

            {/* Video interface */}
            {localStream && <VideoPlayer stream={localStream} muted />}

            {Object.keys(remoteMembers).map((peerId, index) => {
                return (
                    <VideoPlayer
                        key={index}
                        stream={remoteMembers[peerId]}
                    />
                );
            })}
        </>
    );
}
