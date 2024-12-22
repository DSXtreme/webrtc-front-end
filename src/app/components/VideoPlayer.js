import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ stream, muted }) => {
    const videoRef = useRef(null);
    
    useEffect(() => {
        console.log("stream: ", stream);
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <video ref={videoRef} autoPlay playsInline muted={muted}/>
    );
};

export default VideoPlayer;