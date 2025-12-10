import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Smoothie System header', () => {
  render(<App />);
  // 让测试去找 "Smoothie System" 这个标题，而不是找 "learn react"
  const linkElement = screen.getByText(/Smoothie System/i);
  expect(linkElement).toBeInTheDocument();
});
