// ChatGPTCommunication.jsx

import React, { Component } from 'react';
import axios from 'axios';
import SpeakTextComponent from './SpeakTextComponent';
import OpenAITTSComponent from './OpenAITTSComponent';

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
      const { apiKey } = this.props;
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
    const { apiKey } = this.props;
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
        
      <OpenAITTSComponent apiKey={apiKey} input={responseParts[0]} />

      </div>
    );
  }
}

export default ChatGPTCommunication;
