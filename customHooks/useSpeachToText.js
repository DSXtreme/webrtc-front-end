const { useEffect, useState } = require("react");

let recognition;

const useSpeachToText = () => {
    const [text, setText] = useState("");
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = true;
        }

        console.log("recognition", recognition);

        if (SpeechRecognition && recognition) {
            // Event handler for when speech recognition starts
            recognition.onstart = () => {
                setIsListening(true);
                console.log("Speech recognition started");
            };

            // Event handler for when speech recognition results are available
            recognition.onresult = (event) => {
                const current = event.resultIndex;
                const transcriptText = event.results[current][0].transcript;
                setText(transcriptText);
            };

            // Event handler for when an error occurs in speech recognition
            recognition.onerror = (event) => {
                console.error(event.error);
            };

            // Event handler for when speech recognition ends
            recognition.onend = () => {
                console.log("Speech recognition ended");
                setIsListening(false);
            };

            return () => {
                recognition.stop();
            };

            // Start the speech recognition
            // recognition.start();
        }
    }, []);

    const transcribeStartListen = () => {
        console.log("recognition started");
        recognition.start();
    };

    const transcribeStopListen = () => {
        recognition.stop();
    };

    return { text, isListening, transcribeStartListen, transcribeStopListen };
};

export default useSpeachToText;
