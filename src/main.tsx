import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'leaflet/dist/leaflet.css';
import SurveyMapPage from './pages/SurveyMapPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SurveyMapPage />
  </StrictMode>,
);
