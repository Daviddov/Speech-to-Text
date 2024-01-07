import React from 'react';
import { List, ListItem, Avatar, ListItemText, Divider } from '@mui/material';

class ChatComponent extends React.Component {
  renderMessages() {
    const { messages } = this.props;

    return messages.map((message, index) => (
      <div key={index}>
        <ListItem
          sx={{
            display: 'flex',
            flexDirection: message.isAI ? 'row' : 'row-reverse', // Reverse for User messages
            bgcolor: message.isAI ? '#EDEDED' : '#DCF8C6', // Different colors for AI and User
            maxWidth: '400px', // Set the maximum width as needed
            borderRadius: '8px', // Optional: add rounded corners
            margin: 'auto', // Center the message box horizontally

          }}
        >
          <Avatar sx={{ width: 24, height: 24 }} alt={message.isAI ? 'AI' : 'User'} src={message.avatarUrl} />
          <ListItemText
            primary={message.content}
            secondary={message.isAI ? 'AI' : 'User'}
            sx={{ textAlign: message.isAI ? 'left' : 'right' }} // Align text to right for AI messages
          />
        </ListItem>
        {index < messages.length - 1 && <br />}
      </div>
    ));
  }

  render() {
    return <List >{this.renderMessages()}</List>;
  }
}

export default ChatComponent;
