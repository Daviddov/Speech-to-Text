import React, { Component } from 'react';
import SpeechToText from './SpeechToText';
import ChatGPTCommunication from './ChatGPTCommunication';
import OpenAITTSComponent from './OpenAITTSComponent';

class SpeechToTextWithChatGPT extends Component {
  constructor(props) {
    super(props);

    // Check for API key in local storage
    const storedApiKey = localStorage.getItem('apiKey');

    this.state = {
      apiKey: storedApiKey || '', // Use the stored API key if available
      transcription: '',
      aiResponse: '',
    };

    this.handleSpeechRecognitionEnd = this.handleSpeechRecognitionEnd.bind(this);
    this.handleAiResponse = this.handleAiResponse.bind(this);
    this.setApiKey = this.setApiKey.bind(this);
  }

  componentDidMount() {
    // Check if API key is not present in local storage
    if (!this.state.apiKey) {
      const storedApiKey = localStorage.getItem('apiKey');

      if (storedApiKey) {
        // If the API key is already present in local storage, set it in the state
        this.setState({ apiKey: storedApiKey });
      } else {
        // If the API key is not present, prompt the user to enter it
        this.setApiKey();
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { aiResponse } = this.state;

    // Check if aiResponse has changed
    if (aiResponse !== prevState.aiResponse) {
      // Start the audio stream only if the response is non-empty
      if (aiResponse.trim() !== '') {
        this.openAITTSComponentRef.streamAudio();
      }
    }
  }

  handleSpeechRecognitionEnd(transcription) {
    this.setState({ transcription });
    this.sendToChatGPT(transcription);
  }

  handleAiResponse(response) {
    // Update the aiResponse in the state
    this.setState({ aiResponse: response });
  }

  async sendToChatGPT(transcription) {
    // Forward the transcription to ChatGPTCommunication component for further handling
    await this.chatGPTCommunicationRef.sendToChatGPT(transcription);
  }

  setApiKey() {
    const userInput = prompt('Please enter your OpenAI API key. It will be saved only in your local storage:');
    if (userInput) {
      // Save the API key to local storage
      localStorage.setItem('apiKey', userInput);
      this.setState({ apiKey: userInput });
    } else {
      // Handle the case when the user cancels or enters an empty string
      alert('API key is required for the application to work.');
    }
  }

  render() {
    const { apiKey, transcription, aiResponse } = this.state;
    let aiResponseParts = aiResponse.split('|');
    return (
      <div>
        <SpeechToText onSpeechRecognitionEnd={this.handleSpeechRecognitionEnd} />
        <ChatGPTCommunication
          apiKey={apiKey}
          userMessage={transcription}
          aiResponse={aiResponse} // Pass aiResponse as a prop
          onAiResponse={this.handleAiResponse} // Pass the handler function
          setApiKey={this.setApiKey} // Pass the setApiKey function
          ref={(ref) => (this.chatGPTCommunicationRef = ref)}
        />
        <OpenAITTSComponent
          ref={(ref) => (this.openAITTSComponentRef = ref)}
          apiKey={apiKey}
          input={aiResponseParts[0]} // Use transcription instead of aiResponse
        />

        <div>
          <strong>User:</strong> {transcription}
          <div>
            <strong>AI English Teacher:</strong>
            <br />
            {aiResponseParts[0]}
            <br />
            <strong>suggestion:</strong>
            <br />
            {aiResponseParts[1]}
          </div>
        </div>
      </div>
    );
  }
}

export default SpeechToTextWithChatGPT;
