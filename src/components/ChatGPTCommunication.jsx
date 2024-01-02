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
      const {  onAiResponse } = this.props;
      const serverUrl = 'https://tide-peppered-blackberry.glitch.me/api/sendToChatGPT';

      this.setState({ loading: true, error: null });

      const response = await axios.post(serverUrl, { transcription });

      const chatGPTResponse = response.data.chatGPTResponse;
      this.setState({ loading: false });

      // Update the aiResponse in the parent component
      onAiResponse(chatGPTResponse);
    } catch (error) {
      console.error(
        'Error sending transcription to ChatGPT:',
        error.response ? error.response.data : error.message
      );

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
