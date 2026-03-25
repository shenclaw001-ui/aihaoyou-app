import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/Colors';
import useI18n from '../hooks/useI18n';

type VoiceButtonProps = {
  state: 'idle' | 'listening' | 'processing' | 'speaking';
  onPressIn: () => void;
  onPressOut: () => void;
};

export default function VoiceButton({ state, onPressIn, onPressOut }: VoiceButtonProps) {
  const { t } = useI18n();

  const getButtonColor = () => {
    switch (state) {
      case 'listening':
        return Colors.error;
      case 'processing':
        return Colors.warning;
      case 'speaking':
        return Colors.success;
      default:
        return Colors.primary;
    }
  };

  const getButtonText = () => {
    switch (state) {
      case 'listening':
        return t('listening');
      case 'processing':
        return t('processing');
      case 'speaking':
        return t('speaking');
      default:
        return t('holdToTalk');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: getButtonColor() }]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={0.8}
      disabled={state !== 'idle'}
    >
      <View style={styles.innerCircle}>
        <Text style={styles.buttonText}>{getButtonText()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});