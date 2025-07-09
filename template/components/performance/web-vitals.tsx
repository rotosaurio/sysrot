'use client';

import { useEffect, useState } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB, type Metric } from 'web-vitals';

interface PerformanceMetrics {
  cls?: number;
  fid?: number;
  fcp?: number;
  lcp?: number;
  ttfb?: number;
  score?: 'good' | 'needs-improvement' | 'poor';
}

interface WebVitalsProps {
  enableLogging?: boolean;
  enableAnalytics?: boolean;
  onMetric?: (metric: Metric) => void;
}

export function WebVitals({ 
  enableLogging = true, 
  enableAnalytics = false,
  onMetric 
}: WebVitalsProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Function to handle metric collection
    const handleMetric = (metric: Metric) => {
      if (enableLogging) {
        console.log(`[Web Vitals] ${metric.name}:`, metric.value);
      }

      // Update state
      setMetrics(prev => ({
        ...prev,
        [metric.name.toLowerCase()]: metric.value,
        score: calculateOverallScore({
          ...prev,
          [metric.name.toLowerCase()]: metric.value
        })
      }));

      // Send to analytics if enabled
      if (enableAnalytics) {
        sendToAnalytics(metric);
      }

      // Call custom handler if provided
      if (onMetric) {
        onMetric(metric);
      }
    };

    // Collect all Web Vitals
    getCLS(handleMetric);
    getFID(handleMetric);
    getFCP(handleMetric);
    getLCP(handleMetric);
    getTTFB(handleMetric);

    // Performance observer for additional metrics
    if ('PerformanceObserver' in window) {
      // Navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            if (enableLogging) {
              console.log('[Performance] Navigation:', {
                domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
                load: navEntry.loadEventEnd - navEntry.loadEventStart,
                domInteractive: navEntry.domInteractive - navEntry.navigationStart,
                domComplete: navEntry.domComplete - navEntry.navigationStart,
              });
            }
          }
        }
      });

      navObserver.observe({ entryTypes: ['navigation'] });

      // Resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resource = entry as PerformanceResourceTiming;
            // Log slow resources
            if (resource.duration > 1000 && enableLogging) {
              console.warn('[Performance] Slow resource:', {
                name: resource.name,
                duration: resource.duration,
                size: resource.transferSize || 'unknown'
              });
            }
          }
        }
      });

      resourceObserver.observe({ entryTypes: ['resource'] });

      // Cleanup
      return () => {
        navObserver.disconnect();
        resourceObserver.disconnect();
      };
    }
  }, [enableLogging, enableAnalytics, onMetric]);

  // Calculate overall performance score
  const calculateOverallScore = (metrics: PerformanceMetrics): 'good' | 'needs-improvement' | 'poor' => {
    const scores = [];
    
    if (metrics.lcp !== undefined) {
      scores.push(metrics.lcp <= 2500 ? 3 : metrics.lcp <= 4000 ? 2 : 1);
    }
    if (metrics.fid !== undefined) {
      scores.push(metrics.fid <= 100 ? 3 : metrics.fid <= 300 ? 2 : 1);
    }
    if (metrics.cls !== undefined) {
      scores.push(metrics.cls <= 0.1 ? 3 : metrics.cls <= 0.25 ? 2 : 1);
    }
    if (metrics.fcp !== undefined) {
      scores.push(metrics.fcp <= 1800 ? 3 : metrics.fcp <= 3000 ? 2 : 1);
    }
    if (metrics.ttfb !== undefined) {
      scores.push(metrics.ttfb <= 800 ? 3 : metrics.ttfb <= 1800 ? 2 : 1);
    }

    if (scores.length === 0) return 'good';
    
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (average >= 2.5) return 'good';
    if (average >= 2) return 'needs-improvement';
    return 'poor';
  };

  // Send metrics to analytics service
  const sendToAnalytics = (metric: Metric) => {
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }

    // Example: Send to custom analytics endpoint
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        url: window.location.href,
        timestamp: Date.now(),
      }),
    }).catch(console.error);
  };

  // Toggle dashboard visibility
  const toggleDashboard = () => setIsVisible(!isVisible);

  // Performance Dashboard Component
  if (!isVisible) {
    return (
      <button
        onClick={toggleDashboard}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Show Performance Dashboard"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          Performance
        </h3>
        <button
          onClick={toggleDashboard}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        {/* Overall Score */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">Overall:</span>
          <span className={`text-sm font-medium ${
            metrics.score === 'good' ? 'text-green-600' :
            metrics.score === 'needs-improvement' ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {metrics.score === 'good' ? '✅ Good' :
             metrics.score === 'needs-improvement' ? '⚠️ Needs Work' :
             '❌ Poor'}
          </span>
        </div>

        {/* Individual Metrics */}
        {metrics.lcp !== undefined && (
          <MetricRow 
            name="LCP" 
            value={metrics.lcp} 
            unit="ms"
            thresholds={[2500, 4000]}
            description="Largest Contentful Paint"
          />
        )}

        {metrics.fid !== undefined && (
          <MetricRow 
            name="FID" 
            value={metrics.fid} 
            unit="ms"
            thresholds={[100, 300]}
            description="First Input Delay"
          />
        )}

        {metrics.cls !== undefined && (
          <MetricRow 
            name="CLS" 
            value={metrics.cls} 
            unit=""
            thresholds={[0.1, 0.25]}
            description="Cumulative Layout Shift"
            decimals={3}
          />
        )}

        {metrics.fcp !== undefined && (
          <MetricRow 
            name="FCP" 
            value={metrics.fcp} 
            unit="ms"
            thresholds={[1800, 3000]}
            description="First Contentful Paint"
          />
        )}

        {metrics.ttfb !== undefined && (
          <MetricRow 
            name="TTFB" 
            value={metrics.ttfb} 
            unit="ms"
            thresholds={[800, 1800]}
            description="Time to First Byte"
          />
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Core Web Vitals • Real User Metrics
        </p>
      </div>
    </div>
  );
}

interface MetricRowProps {
  name: string;
  value: number;
  unit: string;
  thresholds: [number, number];
  description: string;
  decimals?: number;
}

function MetricRow({ name, value, unit, thresholds, description, decimals = 0 }: MetricRowProps) {
  const getStatus = () => {
    if (value <= thresholds[0]) return 'good';
    if (value <= thresholds[1]) return 'needs-improvement';
    return 'poor';
  };

  const status = getStatus();

  return (
    <div className="flex justify-between items-center" title={description}>
      <span className="text-sm text-gray-600 dark:text-gray-300">{name}:</span>
      <div className="flex items-center space-x-1">
        <span className="text-sm font-mono">
          {value.toFixed(decimals)}{unit}
        </span>
        <span className="text-xs">
          {status === 'good' ? '🟢' : status === 'needs-improvement' ? '🟡' : '🔴'}
        </span>
      </div>
    </div>
  );
}

// Hook for using Web Vitals in other components
export function useWebVitals(onMetric?: (metric: Metric) => void) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});

  useEffect(() => {
    const handleMetric = (metric: Metric) => {
      setMetrics(prev => ({
        ...prev,
        [metric.name.toLowerCase()]: metric.value
      }));
      
      if (onMetric) {
        onMetric(metric);
      }
    };

    getCLS(handleMetric);
    getFID(handleMetric);
    getFCP(handleMetric);
    getLCP(handleMetric);
    getTTFB(handleMetric);
  }, [onMetric]);

  return metrics;
}

export default WebVitals;