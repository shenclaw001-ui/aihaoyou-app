import { useState, useCallback } from 'react';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export default function useVoice() {
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const requestPermissions = useCallback(async () => {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  }, []);

  const startListening = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      throw new Error('Microphone permission denied');
    }

    setState('listening');
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(recording);
    // Simulate speech recognition after 2 seconds
    setTimeout(() => {
      setTranscript('Simulated voice input: Hello, how are you?');
    }, 2000);
  }, [requestPermissions]);

  const stopListening = useCallback(async () => {
    setState('processing');
    if (recording) {
      await recording.stopAndUnloadAsync();
      setRecording(null);
    }
    // Simulate processing delay
    setTimeout(() => {
      setState('idle');
    }, 1000);
    return transcript;
  }, [recording, transcript]);

  const speak = useCallback((text: string) => {
    setState('speaking');
    Speech.speak(text, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
      onDone: () => setState('idle'),
      onError: () => setState('idle'),
    });
  }, []);

  return {
    state,
    transcript,
    startListening,
    stopListening,
    speak,
    requestPermissions,
  };
}