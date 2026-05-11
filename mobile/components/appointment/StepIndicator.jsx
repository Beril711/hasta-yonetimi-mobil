import { View, Text, StyleSheet } from 'react-native';
import { C } from '../../lib/theme';

export default function StepIndicator({ steps, currentStep }) {
  return (
    <View style={styles.container}>
      {steps.map((label, i) => {
        const num = i + 1;
        const done = currentStep > num;
        const active = currentStep === num;
        return (
          <View key={label} style={styles.item}>
            <View style={styles.row}>
              {i > 0 && (
                <View style={[styles.line, done && styles.lineDone]} />
              )}
              <View style={[styles.circle, done && styles.circleDone, active && styles.circleActive]}>
                <Text style={[styles.num, (done || active) && { color: '#fff' }]}>
                  {done ? '✓' : num}
                </Text>
              </View>
              {i < steps.length - 1 && (
                <View style={[styles.line, (done || active) && steps[i + 1] && currentStep > num + 1 && styles.lineDone]} />
              )}
            </View>
            <Text style={[styles.label, active && styles.labelActive, done && styles.labelDone]}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  item: { alignItems: 'center', flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center', marginBottom: 4 },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: C.border,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: { borderColor: C.primary, backgroundColor: C.primary },
  circleDone: { borderColor: C.primary, backgroundColor: C.primary },
  num: { fontSize: 12, fontWeight: '700', color: C.textMuted },
  line: { flex: 1, height: 2, backgroundColor: C.border },
  lineDone: { backgroundColor: C.primary },
  label: { fontSize: 10, color: C.textMuted, fontWeight: '600', textAlign: 'center' },
  labelActive: { color: C.primary },
  labelDone: { color: C.primary },
});
