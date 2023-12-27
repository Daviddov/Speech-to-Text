import React, { Component } from 'react';
import axios from 'axios';

class ChatGPTCommunication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      userMessage: '',  // Add state for userMessage
      aiResponse: '',  // Add state for aiResponse
    };
  }

  speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  async sendToChatGPT(transcription) {
    try {
      const apiKey = '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'; // Replace with your actual OpenAI API key
      const apiUrl = 'https://api.openai.com/v1/chat/completions';
  
      this.setState({ loading: true, error: null });
  
      const response = await axios.post(
        apiUrl,
        {
          model: 'gpt-3.5-turbo-1106',
          messages: [
            {
              role: 'system',
              content: `1. I want you to act as a spoken English teacher and improver. 
              I will speak to you in English and you will reply to me in English 
              to practice my spoken English. I want you to keep your reply neat,
               limiting the reply to 30 words. I want you to correct my grammar mistakes.
                I want you to ask me a question in your reply. Now let's start practicing,
                 you could ask me a question first. Remember,
                  I want you to correct my grammar mistakes.
                  2. Give 3 suggestions for sentences for me to answer you.`,
              // I want you to act as an English teacher I will write you sentences and you will only answer as flow 
              // 1. If the sentence is correct, answer "correct". If not, provide the correct sentence.
              // 2. Continue the conversation. The answer should not be longer than 30 words and entertain.
              // 3. Give 3 suggestions for sentences for me to answer you.
            },
            { role: 'user', content: transcription },
          ],
          // Add temperature and max tokens parameters for a more diverse and concise response
          temperature: 0.7, // Adjust the temperature (higher values for more randomness, lower for more determinism)
          max_tokens: 150, // Limit the response to a certain number of tokens
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
  
      const chatGPTResponse = response.data.choices[0].message.content;
      this.setState({ aiResponse: chatGPTResponse, loading: false });
  
      // Speak the AI response
      this.speakText(chatGPTResponse);
  
      // Process the AI response and lead the next step in the conversation
      const nextStep = this.determineNextStep(transcription, chatGPTResponse);
  
      // Here you can add logic to speak the response or display it in your UI
      // For simplicity, I'm logging it to the console.
      console.log('Next Step:', nextStep);
    } catch (error) {
      console.error(
        'Error sending transcription to ChatGPT:',
        error.response ? error.response.data : error.message
      );
      this.setState({ loading: false, error: 'An error occurred. Please try again.' });
    }
  }
  

  determineNextStep(userMessage, aiResponse) {
    // Example logic: Check if the user is asking a question
    if (userMessage.toLowerCase().includes('how') && userMessage.toLowerCase().includes('do')) {
      return "It looks like you're asking about a process. Let me explain in more detail.";
    } else {
      return "Let's continue our discussion.";
    }
  }

  render() {
    const { loading, error, userMessage, aiResponse } = this.state;

    return (
      <div>
        <div>
          {/* ... (previous code) */}

          <div>
            <div>
              <strong>User:</strong> {userMessage}
            </div>
            <div>
              <strong>AI English Teacher:</strong> {aiResponse}
            </div>
          </div>

          {/* Add a button to trigger text-to-speech */}
          <button onClick={() => this.speakText(aiResponse)} disabled={loading}>
            Speak AI Response
          </button>
        </div>
      </div>
    );
  }
}

export default ChatGPTCommunication;
