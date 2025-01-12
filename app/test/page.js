"use client";
import React, { useState, useEffect } from 'react';

// Check if the browser supports speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

console.log("SpeechRecognition", SpeechRecognition);

const recognition = new SpeechRecognition();
recognition.continuous = true;

const SpeechRecognitionComponent = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };
  }, []);

  const handleListen = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  };

  return (
    <div>
      <h1>Speech Recognition App</h1>
      <button onClick={handleListen}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <p>{transcript}</p>
    </div>
  );
};

export default SpeechRecognitionComponent;
