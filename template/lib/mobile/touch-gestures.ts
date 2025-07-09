// Touch Gestures and Mobile Optimization Library
export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeConfig {
  minDistance: number;
  maxTime: number;
  threshold: number;
}

export interface GestureCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchZoom?: (scale: number) => void;
  onTap?: (point: TouchPoint) => void;
  onDoubleTap?: (point: TouchPoint) => void;
  onLongPress?: (point: TouchPoint) => void;
}

class TouchGestureManager {
  private startTouches: TouchPoint[] = [];
  private lastTap: TouchPoint | null = null;
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private element: HTMLElement;
  private callbacks: GestureCallbacks;
  private config: SwipeConfig;

  constructor(
    element: HTMLElement,
    callbacks: GestureCallbacks,
    config: Partial<SwipeConfig> = {}
  ) {
    this.element = element;
    this.callbacks = callbacks;
    this.config = {
      minDistance: 30,
      maxTime: 1000,
      threshold: 10,
      ...config
    };

    this.attachListeners();
  }

  private attachListeners() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this));
  }

  private handleTouchStart(event: TouchEvent) {
    const now = Date.now();
    this.startTouches = Array.from(event.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      timestamp: now
    }));

    // Handle long press
    if (event.touches.length === 1) {
      const touch = this.startTouches[0];
      this.longPressTimer = setTimeout(() => {
        this.callbacks.onLongPress?.(touch);
        this.triggerHapticFeedback('medium');
      }, 500);
    }

    // Prevent scrolling during gestures if needed
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }

  private handleTouchMove(event: TouchEvent) {
    // Cancel long press on movement
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    // Handle pinch zoom
    if (event.touches.length === 2 && this.startTouches.length === 2) {
      this.handlePinchZoom(event);
    }

    // Prevent default for multi-touch
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }

  private handleTouchEnd(event: TouchEvent) {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    const now = Date.now();
    const endTouch = event.changedTouches[0];
    const endPoint: TouchPoint = {
      x: endTouch.clientX,
      y: endTouch.clientY,
      timestamp: now
    };

    // Handle single touch gestures
    if (this.startTouches.length === 1) {
      const startTouch = this.startTouches[0];
      const duration = now - startTouch.timestamp;
      const distance = this.calculateDistance(startTouch, endPoint);

      if (duration < this.config.maxTime) {
        if (distance < this.config.threshold) {
          // Tap or double tap
          this.handleTap(endPoint);
        } else if (distance > this.config.minDistance) {
          // Swipe
          this.handleSwipe(startTouch, endPoint);
        }
      }
    }

    this.startTouches = [];
  }

  private handleTouchCancel() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    this.startTouches = [];
  }

  private handleTap(point: TouchPoint) {
    const now = Date.now();

    if (this.lastTap && now - this.lastTap.timestamp < 300) {
      // Double tap
      this.callbacks.onDoubleTap?.(point);
      this.triggerHapticFeedback('light');
      this.lastTap = null;
    } else {
      // Single tap
      this.lastTap = point;
      setTimeout(() => {
        if (this.lastTap && this.lastTap.timestamp === point.timestamp) {
          this.callbacks.onTap?.(point);
          this.triggerHapticFeedback('light');
          this.lastTap = null;
        }
      }, 300);
    }
  }

  private handleSwipe(start: TouchPoint, end: TouchPoint) {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0) {
        this.callbacks.onSwipeRight?.();
      } else {
        this.callbacks.onSwipeLeft?.();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        this.callbacks.onSwipeDown?.();
      } else {
        this.callbacks.onSwipeUp?.();
      }
    }

    this.triggerHapticFeedback('medium');
  }

  private handlePinchZoom(event: TouchEvent) {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const currentDistance = this.calculateDistance(
      { x: touch1.clientX, y: touch1.clientY, timestamp: 0 },
      { x: touch2.clientX, y: touch2.clientY, timestamp: 0 }
    );

    const startDistance = this.calculateDistance(
      this.startTouches[0],
      this.startTouches[1]
    );

    const scale = currentDistance / startDistance;
    this.callbacks.onPinchZoom?.(scale);
  }

  private calculateDistance(point1: TouchPoint, point2: TouchPoint): number {
    const deltaX = point2.x - point1.x;
    const deltaY = point2.y - point1.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  private triggerHapticFeedback(type: 'light' | 'medium' | 'heavy') {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  }

  public destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    this.element.removeEventListener('touchcancel', this.handleTouchCancel.bind(this));
  }
}

// Pull to refresh functionality
export class PullToRefresh {
  private element: HTMLElement;
  private onRefresh: () => Promise<void>;
  private threshold: number;
  private startY: number = 0;
  private currentY: number = 0;
  private isRefreshing: boolean = false;
  private isEnabled: boolean = true;

  constructor(
    element: HTMLElement,
    onRefresh: () => Promise<void>,
    threshold: number = 80
  ) {
    this.element = element;
    this.onRefresh = onRefresh;
    this.threshold = threshold;
    this.attachListeners();
  }

  private attachListeners() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
  }

  private handleTouchStart(event: TouchEvent) {
    if (!this.isEnabled || this.isRefreshing) return;
    
    this.startY = event.touches[0].clientY;
    this.currentY = this.startY;
  }

  private handleTouchMove(event: TouchEvent) {
    if (!this.isEnabled || this.isRefreshing) return;

    this.currentY = event.touches[0].clientY;
    const pullDistance = this.currentY - this.startY;

    // Only allow pull down when at top of page
    if (pullDistance > 0 && window.scrollY === 0) {
      event.preventDefault();
      
      // Visual feedback for pull distance
      const opacity = Math.min(pullDistance / this.threshold, 1);
      this.updateRefreshIndicator(opacity, pullDistance >= this.threshold);
    }
  }

  private handleTouchEnd() {
    if (!this.isEnabled || this.isRefreshing) return;

    const pullDistance = this.currentY - this.startY;

    if (pullDistance >= this.threshold && window.scrollY === 0) {
      this.triggerRefresh();
    } else {
      this.resetRefreshIndicator();
    }
  }

  private async triggerRefresh() {
    this.isRefreshing = true;
    this.showRefreshingState();

    try {
      await this.onRefresh();
      navigator.vibrate?.([10, 50, 10]);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      this.isRefreshing = false;
      this.resetRefreshIndicator();
    }
  }

  private updateRefreshIndicator(opacity: number, isReady: boolean) {
    // Update visual indicator based on pull distance
    this.element.style.setProperty('--pull-opacity', opacity.toString());
    this.element.style.setProperty('--pull-ready', isReady ? '1' : '0');
  }

  private showRefreshingState() {
    this.element.style.setProperty('--pull-refreshing', '1');
  }

  private resetRefreshIndicator() {
    this.element.style.setProperty('--pull-opacity', '0');
    this.element.style.setProperty('--pull-ready', '0');
    this.element.style.setProperty('--pull-refreshing', '0');
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
  }
}

// Mobile performance utilities
export class MobilePerformance {
  static optimizeScrolling(element: HTMLElement) {
    // Enable momentum scrolling on iOS
    (element.style as any).webkitOverflowScrolling = 'touch';
    (element.style as any).overflowScrolling = 'touch';
  }

  static enableSmoothTransitions(element: HTMLElement) {
    element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    element.style.willChange = 'transform';
  }

  static preventZoom(element: HTMLElement) {
    element.addEventListener('touchstart', (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    });

    let lastTouchEnd = 0;
    element.addEventListener('touchend', (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }

  static optimizeImages() {
    // Lazy load images that are not in viewport
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  static monitorBatteryUsage(): Promise<any> {
    return new Promise((resolve, reject) => {
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          const batteryInfo = {
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          };

          // Optimize performance based on battery level
          if (battery.level < 0.2 && !battery.charging) {
            // Low battery mode - reduce animations
            document.body.classList.add('battery-save-mode');
          }

          resolve(batteryInfo);
        });
      } else {
        reject(new Error('Battery API not supported'));
      }
    });
  }

  static enableOfflineMode() {
    // Register service worker for offline functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('Service Worker registered:', registration);
      }).catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    }

    // Handle online/offline events
    window.addEventListener('online', () => {
      document.body.classList.remove('offline-mode');
      console.log('App is online');
    });

    window.addEventListener('offline', () => {
      document.body.classList.add('offline-mode');
      console.log('App is offline');
    });
  }
}

// Export utility functions
export function createTouchGestureManager(
  element: HTMLElement,
  callbacks: GestureCallbacks,
  config?: Partial<SwipeConfig>
): TouchGestureManager {
  return new TouchGestureManager(element, callbacks, config);
}

export function createPullToRefresh(
  element: HTMLElement,
  onRefresh: () => Promise<void>,
  threshold?: number
): PullToRefresh {
  return new PullToRefresh(element, onRefresh, threshold);
}

// PWA Installation utilities
export class PWAInstaller {
  private deferredPrompt: any = null;

  constructor() {
    this.setupInstallPrompt();
  }

  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.hideInstallButton();
    });
  }

  public async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted PWA install');
      return true;
    } else {
      console.log('User dismissed PWA install');
      return false;
    }
  }

  private showInstallButton() {
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.style.display = 'block';
    }
  }

  private hideInstallButton() {
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.style.display = 'none';
    }
  }

  public isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone ||
           document.referrer.includes('android-app://');
  }
}

export default {
  TouchGestureManager,
  PullToRefresh,
  MobilePerformance,
  PWAInstaller,
  createTouchGestureManager,
  createPullToRefresh
};