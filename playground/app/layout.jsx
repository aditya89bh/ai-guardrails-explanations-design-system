import './globals.css';

export const metadata = {
  title: 'Guardrail Decision Engine — Interactive Playground',
  description: 'Visualize how the AI Guardrails & Explanations Design System decision engine selects patterns and activates components based on decision primitives.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
