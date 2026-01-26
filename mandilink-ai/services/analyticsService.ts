import { AnalyticsEvent } from "../types";

class AnalyticsService {
  private queue: AnalyticsEvent[] = [];

  /**
   * Logs a user event.
   */
  logEvent(eventName: string, userId?: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      eventName,
      userId,
      properties,
      timestamp: Date.now()
    };
    
    this.queue.push(event);
    
    // In a real app, this would flush to an endpoint like Mixpanel or Google Analytics
    console.log(`[Analytics] ${eventName}`, event);
  }

  /**
   * Flushes queue (Simulated)
   */
  async flush() {
    if (this.queue.length === 0) return;
    // Simulate API call
    // await fetch('/api/analytics', { body: JSON.stringify(this.queue) ... })
    this.queue = [];
  }
}

export const analyticsService = new AnalyticsService();