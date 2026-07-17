import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main landing page content', () => {
  render(<App />);

  expect(screen.getByText(/Nourish Your Family With Ancient Grains/i)).toBeInTheDocument();
  expect(screen.getByText(/The Story of Bharathi's Kitchen/i)).toBeInTheDocument();
  expect(screen.getByText(/Order Fresh Sathu Maavu/i)).toBeInTheDocument();
});

test('shows the size options and chat assistant entry point', () => {
  render(<App />);

  expect(screen.getByRole('button', { name: /250g/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /1kg/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /chat with bharathi/i })).toBeInTheDocument();
});
