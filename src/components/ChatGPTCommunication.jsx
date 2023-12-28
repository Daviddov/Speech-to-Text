import React, { Component } from 'react';
import axios from 'axios';

class ChatGPTCommunication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      userMessage: '',
    };
  }

  async sendToChatGPT(transcription) {
    try {
      const { apiKey, onAiResponse } = this.props;
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
              you will reply to me in English to practice my spoken English.
              limiting the reply to 40 words. ask me a question in your reply. 
              you could ask me a question first. after "|" Offer me a sentence to answer you`,
            },
            { role: 'user', content: transcription },
          ],
          temperature: 0.7,
          max_tokens: 150,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const chatGPTResponse = response.data.choices[0].message.content;
      this.setState({ loading: false });

      // Update the aiResponse in the parent component
      onAiResponse(chatGPTResponse);
    } catch (error) {
      console.error(
        'Error sending transcription to ChatGPT:',
        error.response ? error.response.data : error.message
      );

      // Check if the error is related to the API key
      if (error.response && error.response.status === 401) {
        const userInput = prompt('Incorrect or missing API key. Please enter your API key:');
        if (userInput) {
          // Retry with the new API key
          this.props.setApiKey(userInput);
          // this.sendToChatGPT(transcription);
        } else {
          // Handle the case when the user cancels or enters an empty string
          alert('API key is required for the application to work.');
        }
      } else {
        // Handle other types of errors
        this.setState({ loading: false, error: 'An error occurred. Please try again.' });
      }
    }
  }

  render() {
    const { loading, error, userMessage } = this.state;

    return (
      <div>
        {/* Render loading spinner or error message if needed */}
      </div>
    );
  }
}

export default ChatGPTCommunication;
