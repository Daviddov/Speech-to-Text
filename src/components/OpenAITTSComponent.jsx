import React, { useState } from 'react';
import axios from 'axios';

const OpenAITTSComponent = () => {
  const [loading, setLoading] = useState(false);

  const streamAudio = async () => {
    setLoading(true);

    const apiKey = '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'; // Replace with your actual OpenAI API key
    const apiUrl = 'https://api.openai.com/v1/audio/speech';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: 'nova',   //alloy, echo, fable, onyx, nova, and shimmer
          input: 'Hello world! This is a streaming test.',
        }),
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Use the generated audio URL as needed, e.g., play it in an audio element
      const audioElement = new Audio(url);
      audioElement.play();
    } catch (error) {
      console.error('Error streaming audio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={streamAudio} disabled={loading}>
        Stream Audio
      </button>
    </div>
  );
};

export default OpenAITTSComponent;
