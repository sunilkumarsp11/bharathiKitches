import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main landing page content', () => {
  render(<App />);

  expect(screen.getByText(/Nourish Your Family With Ancient Grains/i)).toBeInTheDocument();
  expect(screen.getByText(/The Story of Bharathi's Kitchen/i)).toBeInTheDocument();
  expect(screen.getByText(/Order Fresh Sathu Maavu/i)).toBeInTheDocument();
});
