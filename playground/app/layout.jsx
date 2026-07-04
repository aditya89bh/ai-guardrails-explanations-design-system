import './globals.css';

export const metadata = {
  title: 'Guardrail Decision Engine — Interactive Playground',
  description: 'Visualize how the AI Guardrails & Explanations Design System decision engine selects patterns and activates components based on decision primitives.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Skip navigation link for keyboard users */}
        <a href="#pg-main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
