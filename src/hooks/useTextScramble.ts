import { useState, useEffect } from 'react';

const CHARACTERS = '!@#$%^&*()_+{}:"<>?/.,;[]=-';

export const useTextScramble = (text: string, isHovered: boolean, duration: number = 300) => {
    const [scrambledText, setScrambledText] = useState(text);

    useEffect(() => {
        if (!isHovered) {
            setScrambledText(text);
            return;
        }

        let interval: ReturnType<typeof setInterval>;
        let iteration = 0;
        const totalIterations = Math.floor(duration / 30); // update roughly every 30ms

        interval = setInterval(() => {
            setScrambledText(() =>
                text
                    .split('')
                    .map((char, index) => {
                        // Keep spaces intact
                        if (char === ' ') return ' ';

                        // Reveal characters progressively
                        if (index < (iteration / totalIterations) * text.length) {
                            return text[index];
                        }

                        // Otherwise show a random character
                        return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                    })
                    .join('')
            );

            if (iteration >= totalIterations) {
                clearInterval(interval);
                setScrambledText(text); // Ensure it ends exactly on the original string
            }

            iteration++;
        }, 30);

        return () => clearInterval(interval);
    }, [isHovered, text, duration]);

    return scrambledText;
};
