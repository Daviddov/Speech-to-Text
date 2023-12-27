import React from 'react';

class SpeakTextComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSpeaking: false,
    };
  }

  componentDidMount() {
    // Start speaking when the component mounts
    this.speakText(this.props.text);
  }

  speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => {
      this.setState({ isSpeaking: false });
    };

    this.setState({ isSpeaking: true });
    synth.speak(utterance);
  };

  stopSpeaking = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    this.setState({ isSpeaking: false });
  };

  handleButtonClick = () => {
    // Toggle between start and stop speaking
    this.state.isSpeaking ? this.stopSpeaking() : this.speakText(this.props.text);
  };

  render() {
    const { loading } = this.props;
    const { isSpeaking } = this.state;

    return (
      <div>
        <button onClick={this.handleButtonClick} disabled={loading}>
          {isSpeaking ? 'Stop Speaking' : 'Start/Resume Speaking'}
        </button>
      </div>
    );
  }
}

export default SpeakTextComponent;
