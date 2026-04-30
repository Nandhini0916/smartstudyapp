import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import socketService from '../../services/socket';

export default function AITutor() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: "Hi! I'm your AI Tutor. Ask me anything!", isUser: false },
  ]);

  React.useEffect(() => {
    const socket = socketService.connect();
    
    socket.on('chat-response', (data: any) => {
      setMessages(prev => [...prev, data]);
    });
    
    return () => {
      socket.off('chat-response');
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now().toString(), text: message, isUser: true }]);
    const currentMessage = message;
    setMessage('');
    
    const socket = socketService.connect();
    socket.emit('chat-message', { message: currentMessage });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#4A6CF7', '#6B8CF7']} style={styles.header}>
        <Text style={styles.headerTitle}>AI Tutor</Text>
        <Text style={styles.headerSubtitle}>Ask anything, learn instantly</Text>
      </LinearGradient>

      <ScrollView style={styles.messagesContainer}>
        {messages.map(msg => (
          <View key={msg.id} style={[styles.messageRow, msg.isUser ? styles.userRow : styles.aiRow]}>
            <View style={[styles.messageBubble, msg.isUser ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.messageText, msg.isUser ? styles.userText : styles.aiText]}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me anything..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageRow: {
    marginBottom: 16,
  },
  userRow: {
    alignItems: 'flex-end',
  },
  aiRow: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#4A6CF7',
  },
  aiBubble: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F8',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#4A6CF7',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});