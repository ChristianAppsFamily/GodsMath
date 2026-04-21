import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Trash2, Calculator, Banknote, Receipt, TrendingUp } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import AdBanner from '@/components/AdBanner';
import { useHistory } from '@/contexts/HistoryContext';
import { CalculationHistory } from '@/types/calculator';

function getTypeIcon(type: CalculationHistory['type']) {
  const iconProps = { size: 18, color: Colors.accent };
  switch (type) {
    case 'loan':
      return <Banknote {...iconProps} />;
    case 'tip':
      return <Receipt {...iconProps} />;
    case 'interest':
      return <TrendingUp {...iconProps} />;
    default:
      return <Calculator {...iconProps} />;
  }
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface HistoryItemProps {
  item: CalculationHistory;
  onDelete: (id: string) => void;
}

function HistoryItem({ item, onDelete }: HistoryItemProps) {
  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete(item.id);
  };

  return (
    <View style={styles.item}>
      <View style={styles.iconContainer}>
        {getTypeIcon(item.type)}
      </View>
      <View style={styles.itemContent}>
        {item.label && <Text style={styles.label}>{item.label}</Text>}
        <Text style={styles.expression} numberOfLines={1}>{item.expression}</Text>
        <Text style={styles.result}>= {item.result}</Text>
        <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={handleDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Trash2 size={18} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { history, isLoading, clearHistory, deleteEntry } = useHistory();

  const handleClearAll = useCallback(() => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            clearHistory();
          }
        },
      ]
    );
  }, [clearHistory]);

  const renderItem = useCallback(({ item }: { item: CalculationHistory }) => (
    <HistoryItem item={item} onDelete={deleteEntry} />
  ), [deleteEntry]);

  const keyExtractor = useCallback((item: CalculationHistory) => item.id, []);

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {history.length > 0 ? (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>{history.length} calculations</Text>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearButton}>Clear All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Calculator size={48} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptyText}>
            Your calculations will appear here
          </Text>
        </View>
      )}
      <View style={[styles.adContainer, { paddingBottom: insets.bottom > 0 ? 0 : 8 }]}>
        <AdBanner />
      </View>
    </View>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  clearButton: {
    fontSize: 14,
    color: Colors.danger,
    fontWeight: '600' as const,
  },
  list: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.accent,
    marginBottom: 2,
  },
  expression: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  result: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    opacity: 0.7,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  adContainer: {
    marginTop: 8,
  },
});
