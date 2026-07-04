import './globals.css';

export const metadata = {
  title: 'Guardrail Decision Engine — Interactive Playground',
  description: 'Visualize how the AI Guardrails & Explanations Design System decision engine selects patterns and activates components based on decision primitives P1–P10. Load industry scenarios, inspect rule evaluation, and explore pattern composition.',
  keywords: 'AI guardrails, decision engine, design system, pattern library, interactive playground',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
