import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { listModels } from '../services/ollama';
import useConversationStore from '../store/useConversationStore';
import { Colors } from '../constants/Colors';
import useI18n from '../hooks/useI18n';

export default function ModelPicker() {
  const { t } = useI18n();
  const { currentModel, setModel } = useConversationStore();
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const modelList = await listModels();
      const modelIds = modelList.map(m => m.id).filter(Boolean);
      setModels(modelIds);
      if (modelIds.length > 0 && !modelIds.includes(currentModel)) {
        // Auto‑select the first model if current not in list
        setModel(modelIds[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.hint}>{t('loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{t('error')}: {error}</Text>
        <TouchableOpacity onPress={loadModels} style={styles.retryButton}>
          <Text style={styles.retryText}>{t('retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (models.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.hint}>{t('noModels')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('model')}:</Text>
      <View style={styles.modelList}>
        {models.map(model => (
          <TouchableOpacity
            key={model}
            style={[
              styles.modelButton,
              model === currentModel && styles.modelButtonSelected,
            ]}
            onPress={() => setModel(model)}
          >
            <Text
              style={[
                styles.modelText,
                model === currentModel && styles.modelTextSelected,
              ]}
            >
              {model}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  modelList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modelButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modelText: {
    fontSize: 14,
    color: Colors.text,
  },
  modelTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
  error: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.error,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryText: {
    color: Colors.white,
    fontWeight: '600',
  },
});