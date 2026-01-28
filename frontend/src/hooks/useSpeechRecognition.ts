"use client";

import { useState, useEffect, useCallback } from "react";

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
}

interface SpeechRecognitionEvent {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

interface UseSpeechRecognitionOptions {
    onResult?: (transcript: string) => void;
    onError?: (error: string) => void;
    continuous?: boolean;
    language?: string;
}

interface SpeechRecognitionHook {
    isListening: boolean;
    transcript: string;
    startListening: () => void;
    stopListening: () => void;
    isSupported: boolean;
}

export function useSpeechRecognition(
    options: UseSpeechRecognitionOptions = {}
): SpeechRecognitionHook {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [isSupported, setIsSupported] = useState(false);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

    const {
        onResult,
        onError,
        continuous = false,
        language = "en-US"
    } = options;

    useEffect(() => {
        // Check for browser support
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
            setIsSupported(true);
            const recognitionInstance = new SpeechRecognition();

            recognitionInstance.continuous = continuous;
            recognitionInstance.interimResults = true;
            recognitionInstance.lang = language;

            recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
                const current = event.resultIndex;
                const transcriptResult = event.results[current][0].transcript;

                setTranscript(transcriptResult);

                if (event.results[current].isFinal && onResult) {
                    onResult(transcriptResult);
                }
            };

            recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
                if (onError) {
                    onError(event.error);
                }
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        } else {
            setIsSupported(false);
        }

        return () => {
            if (recognition) {
                recognition.abort();
            }
        };
    }, [continuous, language]); // eslint-disable-line react-hooks/exhaustive-deps

    const startListening = useCallback(() => {
        if (recognition && !isListening) {
            setTranscript("");
            recognition.start();
            setIsListening(true);
        }
    }, [recognition, isListening]);

    const stopListening = useCallback(() => {
        if (recognition && isListening) {
            recognition.stop();
            setIsListening(false);
        }
    }, [recognition, isListening]);

    return {
        isListening,
        transcript,
        startListening,
        stopListening,
        isSupported,
    };
}
