import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BookOpen, RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { BIBLE_VERSES, getDailyVerse, type BibleVerse } from '@/constants/bibleVerses';

export default function DailyVerse() {
  const dailyVerse = useMemo(() => getDailyVerse(), []);
  const [verse, setVerse] = useState<BibleVerse>(dailyVerse);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const handleRefresh = useCallback(() => {
    const next = BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)];
    setVerse(next);
    setIsCustom(true);
    console.log('[DailyVerse] Random verse:', next.reference);
  }, []);

  const handleReset = useCallback(() => {
    setVerse(dailyVerse);
    setIsCustom(false);
  }, [dailyVerse]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={isCustom ? handleReset : handleRefresh}
      activeOpacity={0.8}
      testID="daily-verse"
    >
      <View style={styles.header}>
        <BookOpen size={12} color={Colors.accent} />
        <Text style={styles.label}>{isCustom ? 'VERSE' : 'VERSE OF THE DAY'}</Text>
        <View style={styles.refreshBtn}>
          <RefreshCw size={11} color={Colors.textSecondary} />
        </View>
      </View>
      <Text style={styles.verseText} numberOfLines={2}>
        &ldquo;{verse.text}&rdquo;
      </Text>
      <Text style={styles.reference}>{verse.reference}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.accent,
    letterSpacing: 1,
    flex: 1,
  },
  refreshBtn: {
    opacity: 0.6,
  },
  verseText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
    fontStyle: 'italic' as const,
  },
  reference: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '600' as const,
  },
});
