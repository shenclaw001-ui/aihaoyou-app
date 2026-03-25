import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants/Colors';
import useVoice from '../hooks/useVoice';
import useI18n from '../hooks/useI18n';
import useConversationStore from '../store/useConversationStore';
import MessageBubble from '../components/MessageBubble';
import VoiceButton from '../components/VoiceButton';
import LanguagePicker from '../components/LanguagePicker';

export default function ChatScreen() {
  const {
    messages,
    isProcessing,
    sendUserMessage,
    clearConversation,
  } = useConversationStore();
  const { state, startListening, stopListening, speak } = useVoice();
  const { t } = useI18n();
  const [textInput, setTextInput] = React.useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!textInput.trim()) return;
    const text = textInput.trim();
    setTextInput('');
    await sendUserMessage(text);
  };

  const handleVoicePressIn = async () => {
    await startListening();
  };

  const handleVoicePressOut = async () => {
    const transcript = await stopListening();
    if (transcript?.trim()) {
      await sendUserMessage(transcript);
    }
  };

  const handleSpeakLast = () => {
    const lastAiMessage = messages.filter((m) => m.sender === 'ai').pop();
    if (lastAiMessage) {
      speak(lastAiMessage.text);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('appTitle')}</Text>
        <TouchableOpacity onPress={clearConversation} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>{t('clear')}</Text>
        </TouchableOpacity>
      </View>

      <LanguagePicker />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <MessageBubble message={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {t('startConversation')}
            </Text>
          </View>
        }
      />

      {isProcessing && (
        <View style={styles.processingIndicator}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.processingText}>{t('aiThinking')}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={t('typeMessage')}
          value={textInput}
          onChangeText={setTextInput}
          onSubmitEditing={handleSend}
          editable={!isProcessing}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!textInput.trim() || isProcessing) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!textInput.trim() || isProcessing}
        >
          <Text style={styles.sendButtonText}>{t('send')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.voiceContainer}>
        <VoiceButton
          state={state}
          onPressIn={handleVoicePressIn}
          onPressOut={handleVoicePressOut}
        />
        <TouchableOpacity style={styles.speakButton} onPress={handleSpeakLast}>
          <Text style={styles.speakButtonText}>{t('repeat')}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        {t('hint')}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.error,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  processingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  processingText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  voiceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: Colors.surface,
  },
  speakButton: {
    marginLeft: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.secondary,
    borderRadius: 20,
  },
  speakButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textSecondary,
    paddingBottom: 20,
    backgroundColor: Colors.surface,
  },
});