// ChatGPTCommunication.jsx

import React, { Component } from 'react';
import axios from 'axios';
import SpeakTextComponent from './SpeakTextComponent';

class ChatGPTCommunication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      userMessage: '',
      aiResponse: '',
    };
  }

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
              content: `I want you to act as a spoken English teacher and improver. 
              you will reply to me in English 
              to practice my spoken English. I want you to keep your reply neat,
               limiting the reply to 40 words. correct my grammar mistakes.
                 ask me a question in your reply. 
                 you could ask me a question first. Remember,
                  I want you to correct my grammar mistakes. after that put "|" and
                  Give 3 suggestions for sentences for me to answer you. 
                  and reply If the sentence is correct, If not, provide the correct sentence.`,
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
      const responseParts = chatGPTResponse.split('|');
      // Speak the AI response
      this.speakText(responseParts[0]);
  
   
    } catch (error) {
      console.error(
        'Error sending transcription to ChatGPT:',
        error.response ? error.response.data : error.message
      );
      this.setState({ loading: false, error: 'An error occurred. Please try again.' });
    }
  }

  render() {
    const { loading, error, userMessage, aiResponse } = this.state;
    const responseParts = aiResponse.split('|');

    return (
      <div>
        <div>
          <div>
            <strong>User:</strong> {userMessage}
          </div>
          <div>
            <strong>AI English Teacher:</strong> {responseParts[0]}
            <br /> <br />
            {responseParts[1]}

          </div>
        </div>
        <SpeakTextComponent text={responseParts[0]} loading={loading} />
      </div>
    );
  }
}

export default ChatGPTCommunication;
