import type { Metric } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (typeof onPerfEntry === 'function') {
    import('web-vitals')
      .then((webVitals) => {
        const { onCLS, onINP, onFCP, onLCP, onTTFB } = webVitals;
        onCLS(onPerfEntry);
        onINP(onPerfEntry);
        onFCP(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
      })
      .catch((err) => {
        console.error('Error loading web-vitals', err);
      });
  }
};

export default reportWebVitals;
