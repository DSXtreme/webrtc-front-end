"use client"

import React, { useState, useEffect, useRef } from 'react';

const ScreenAudioCapture = () => {
  const [stream, setStream] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const canvasRef = useRef(null);

  const startCapture = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: false,
        audio: true
      });

      setStream(displayStream);

      const audioTracks = displayStream.getAudioTracks();
      const recorder = new MediaRecorder(displayStream);
      const chunks = [];
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(displayStream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2;

          canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
          canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);

          x += barWidth + 1;
        }
      };

      draw();

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);

      // Stop recording after a certain time (e.g., 5 seconds)
      setTimeout(() => {
        recorder.stop();
      }, 5000);

    } catch (err) {
      console.error('Error: ' + err);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div>
      <button onClick={startCapture} disabled={isRecording}>Start Capture</button>
      <canvas ref={canvasRef} width="600" height="100"></canvas>
      {audioUrl && (
        <audio src={audioUrl} controls />
      )}
    </div>
  );
};

export default ScreenAudioCapture;
