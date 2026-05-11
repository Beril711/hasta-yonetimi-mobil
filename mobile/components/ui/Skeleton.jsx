import { View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export default function Skeleton({ width = '100%', height = 20, style }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.skeleton, { width, height, opacity }, style]} />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginVertical: 4
  }
});