import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import useI18n from '../hooks/useI18n';

const languages = [
  { code: 'en', name: 'english' },
  { code: 'zh-CN', name: 'chinese' },
  { code: 'ko', name: 'korean' },
  { code: 'ja', name: 'japanese' },
];

export default function LanguagePicker() {
  const { t, locale, setLocale } = useI18n();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('language')}</Text>
      <View style={styles.buttonRow}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.button,
              locale.startsWith(lang.code) && styles.buttonActive,
            ]}
            onPress={() => setLocale(lang.code)}
          >
            <Text
              style={[
                styles.buttonText,
                locale.startsWith(lang.code) && styles.buttonTextActive,
              ]}
            >
              {t(lang.name)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  buttonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.text,
  },
  buttonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});