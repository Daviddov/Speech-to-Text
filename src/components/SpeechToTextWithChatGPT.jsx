import React, { Component } from 'react';
import SpeechToText from './SpeechToText';
import ChatGPTCommunication from './ChatGPTCommunication';
import OpenAITTSComponent from './OpenAITTSComponent';
// import SpeakText from './SpeakText';
import TextToSpeech from './TextToSpeech';

class SpeechToTextWithChatGPT extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transcription: '',
      aiResponse: '',
      password: '',

    };

    this.handleSpeechRecognitionEnd = this.handleSpeechRecognitionEnd.bind(this);
    this.handleAiResponse = this.handleAiResponse.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { aiResponse, password } = this.state;

    // Check if aiResponse has changed
    if (aiResponse !== prevState.aiResponse) {
      // Start the audio stream only if the response is non-empty and password is correct
      if (aiResponse.trim() !== '' && password === 'VIP') {
        this.openAITTSComponentRef.streamAudio();
      } else {
        this.TextToSpeechRef.handleSpeak();
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

  handlePasswordInput(event) {
    this.setState({ password: event.target.value });
  }

  handlePasswordSubmit(event) {
    event.preventDefault();
    // Handle password submission, you can add more validation if needed
    // For simplicity, direct comparison is used here. In real applications, you might want to use more secure methods.
    if (this.state.password === 'VIP') {
      this.openAITTSComponentRef.streamAudio();
    } else {
      this.TextToSpeechRef.handleSpeak();
    }
  }
  
  async sendToChatGPT(transcription) {
    // Forward the transcription to ChatGPTCommunication component for further handling
    await this.chatGPTCommunicationRef.sendToChatGPT(transcription);
  }

  render() {
    const { transcription, aiResponse, password } = this.state;
    let aiResponseParts = aiResponse.split('|');

    return (
      <div>
                <form onSubmit={this.handlePasswordSubmit}>
          <label>
            Password:
            <input type="password" value={password} onChange={this.handlePasswordInput} />
          </label>
          <button type="submit">Submit</button>
        </form>
        
        <SpeechToText onSpeechRecognitionEnd={this.handleSpeechRecognitionEnd} />
        <ChatGPTCommunication
          userMessage={transcription}
          aiResponse={aiResponse} // Pass aiResponse as a prop
          onAiResponse={this.handleAiResponse} // Pass the handler function
          ref={(ref) => (this.chatGPTCommunicationRef = ref)}
        />

          <TextToSpeech  ref={(ref) => (this.TextToSpeechRef = ref)}
          input={aiResponseParts[0]}/>
        <OpenAITTSComponent
          ref={(ref) => (this.openAITTSComponentRef = ref)}
          input={aiResponseParts[0]} // Use transcription instead of aiResponse
        />

        <div>
          <strong>User:</strong> {transcription}
            <br />
            {aiResponseParts[2]}
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
