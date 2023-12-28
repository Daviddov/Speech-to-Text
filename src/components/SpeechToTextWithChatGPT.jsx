import React, { Component } from 'react';
import SpeechToText from './SpeechToText';
import ChatGPTCommunication from './ChatGPTCommunication';
import OpenAITTSComponent from './OpenAITTSComponent';

class SpeechToTextWithChatGPT extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiKey: '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',
      transcription: '',
      aiResponse: '',
    };

    this.handleSpeechRecognitionEnd = this.handleSpeechRecognitionEnd.bind(this);
    this.handleAiResponse = this.handleAiResponse.bind(this);
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
