import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProviders } from './components/AppProviders';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);