import React from 'react';
import { render, screen } from '@testing-library/react-native';
import HomeScreen from '../app/index';

test('Ana ekran doğru render ediliyor', () => {
  render(<HomeScreen />);
  expect(screen.getByText('Hasta Yönetimi')).toBeTruthy();
  expect(screen.getByText('Mobil Uygulama çalışıyor 🚀')).toBeTruthy();
});