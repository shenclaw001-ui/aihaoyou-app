import { useState, useCallback } from 'react';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import * as SpeechRecognition from 'expo-speech-recognition';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export default function useVoice() {
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const requestPermissions = useCallback(async () => {
    const [audioStatus, speechStatus] = await Promise.all([
      Audio.requestPermissionsAsync(),
      SpeechRecognition.requestPermissionsAsync(),
    ]);
    return audioStatus.granted && speechStatus.granted;
  }, []);

  const startListening = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      throw new Error('Microphone or speech recognition permission denied');
    }

    setState('listening');
    await SpeechRecognition.startListeningAsync({
      language: 'en',
      interimResults: true,
    });
    // Start recording for backup
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(recording);
  }, [requestPermissions]);

  const stopListening = useCallback(async () => {
    setState('processing');
    await SpeechRecognition.stopListeningAsync();
    if (recording) {
      await recording.stopAndUnloadAsync();
      setRecording(null);
    }
    const result = await SpeechRecognition.getAvailablePermissionsAsync();
    // For now, we'll use the transcript from expo-speech-recognition
    // In a real app, you might also process the recording file.
    setState('idle');
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