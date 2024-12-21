"use client";
import {
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { RoomContext } from "./context/roomContext";
import Peer from "peerjs";
import { v4 as uuid4 } from "uuid";

export default function Home() {
    const videoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const { io } = useContext(RoomContext);

    const [roomId, setRoomId] = useState(null);
    const [localPeer, setLocalPeer] = useState(null);
    const [inputRoomId, setInputRoomId] = useState(null);

    // setting remote peer and its stream
    /**
     *
     */
    const [remotePeerInfo, setRemotePeerInfo] = useState(null);

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

        // gettin new user info
        io.on("get-user", (user) => {
            console.log("New user: ", user);
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
     *  Sending the stream to other users in the room
     */
    useEffect(() => {
        (async () => {
            // getting the stream form local machine
            try {
               

                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true,
                });

                videoRef.current.srcObject = stream;

                //calling user who have joined and passing the stream
                io.on("user-joined", ({ peerId }) => {
                    console.log("localPeer", localPeer);

                    if (localPeer) {
                        const call = localPeer.call(peerId, stream);

                        // While getting remote user stream assign to remote video
                        call.on("stream", (peerStream) => {
                            console.log("call peer call: ", { peerStream });
                            remoteVideoRef.current.srcObject = peerStream;
                        });
                    }
                });

                // answer the call
                if (localPeer) {
                    localPeer.on("call", (call) => {
                        call.answer(stream);
                        call.on("stream", (peerStream) => {
                            console.log("answer peer strema: ", { peerStream });
                            remoteVideoRef.current.srcObject = peerStream;
                        });
                    });
                }
            } catch (e) {
                console.log("error at getting media: ", e);
            }
        })();
    }, [localPeer]);

    return (
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

            <video ref={videoRef} width={300} autoPlay muted />
            <video ref={remoteVideoRef} width={300} autoPlay />
        </>
    );
}
