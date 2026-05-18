import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TimeSlotPicker({ slots, selectedSlot, onSelect }) {
  if (!slots || slots.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Tarih seçin, müsait saatler yüklensin</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {slots.map((slot) => {
        const time = new Date(slot.slot_date).toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const isSelected = selectedSlot === slot.slot_date;
        const isDisabled = !slot.is_available;

        return (
          <TouchableOpacity
            key={slot.slot_date}
            onPress={() => !isDisabled && onSelect(slot.slot_date)}
            disabled={isDisabled}
            style={[
              styles.slot,
              isSelected && styles.slotSelected,
              isDisabled && styles.slotDisabled,
            ]}
          >
            <Text
              style={[
                styles.slotText,
                isSelected && styles.slotTextSelected,
                isDisabled && styles.slotTextDisabled,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  empty: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#515561', fontSize: 13 },
  slot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },
  slotSelected: { backgroundColor: '#1F3555', borderColor: '#1F3555' },
  slotDisabled: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },
  slotText: { fontSize: 14, fontWeight: '500', color: '#242740' },
  slotTextSelected: { color: '#FFF' },
  slotTextDisabled: { color: '#9CA3AF', textDecorationLine: 'line-through' },
});