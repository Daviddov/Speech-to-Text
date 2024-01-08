import React, { Component } from 'react';
import axios from 'axios';
import BlubToAudio from './BlubToAudio';

class ChatGPTCommunication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      userMessage: '',
      chatGPTResponse: null,
      chatGPTSuggestion: null,
      audioData: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { chatGPTResponse } = this.state;

    // Check if chatGPTResponse has changed
    if (chatGPTResponse !== prevState.chatGPTResponse) {
      // Start the audio stream only if the response is non-empty
      if (chatGPTResponse && chatGPTResponse.trim() !== '') {
        this.openAITTSComponentRef.setupAudio();
      }
    }
  }
  async sendChatGPTSuggestion(aiResponse) {
    try {
      const { onResponseSuggestion } = this.props;
  
      // Define server URLs
      const server = "https://tide-peppered-blackberry.glitch.me";
      const local = "http://localhost:3001";
      const serverUrl = `${local}/chatGPTSuggestion`; // || server
  
      // Set loading state and clear any previous errors
      this.setState({ loading: true, error: null });
  
      // Send the AI response to the server
      const response = await axios.post(serverUrl, { aiResponse });
  
      // Extract chatGPTResponse from the server response
      const chatGPTSuggestion = response.data.chatGPTResponse;
  
      // Update the state 
      this.setState({ loading: false});
  
      // Update the aiResponse in the parent component
      onResponseSuggestion(chatGPTSuggestion);
    } catch (error) {
      console.error('Error sending chatGPTSuggestion to ChatGPT:', error);
      
      // Set loading to false and display an error message
      this.setState({ loading: false, error: 'An error occurred. Please try again.' });
    }
  }
  
  async sendToChatGPT(transcription, history) {
    try {
      const { onAiResponse, userName, voiceName } = this.props;
      const server = "https://tide-peppered-blackberry.glitch.me" ;
      const local = "http://localhost:3001";
      const serverUrl = `${local}/sendToChatGPTAndAudio`; // || server

      this.setState({ loading: true, error: null });

      const response = await axios.post(serverUrl, { transcription, history, userName, voiceName });

      const chatGPTResponse = response.data.chatGPTResponse;
      const blobResponse = response.data.blobResponse;


      // Update the state with the chatGPTResponse and audioData
      this.setState({ loading: false, chatGPTResponse, audioData: blobResponse });

      // Update the aiResponse in the parent component
      onAiResponse(chatGPTResponse);
    } catch (error) {
      console.error('Error sending transcription to ChatGPT:', error.response ? error.response.data : error.message);
      this.setState({ loading: false, error: 'An error occurred. Please try again.' });
    }
  }

  render() {
    const { loading, error, audioData, userMessage } = this.state;

    return (
      <div>
        {/* Render the OpenAITTSComponent with the audio data from the server */}
        <BlubToAudio ref={(ref) => (this.openAITTSComponentRef = ref)} audioData={audioData} />

        {/* You can render other components or UI elements here */}
      </div>
    );
  }
}

export default ChatGPTCommunication;
