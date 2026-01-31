import type { Listing } from '../types';

export const shareUtils = {
  /**
   * Share listing via Web Share API or fallback to WhatsApp
   */
  async shareListing(listing: Listing): Promise<boolean> {
    const shareText = `🌾 ${listing.produceName} - ₹${listing.pricePerUnit}/${listing.unit}\n` +
      `📦 Quantity: ${listing.quantity} ${listing.unit}\n` +
      `📍 Location: ${listing.location}\n` +
      `👨‍🌾 Seller: ${listing.sellerName}\n\n` +
      `View on Mandi Mitra: ${window.location.origin}`;

    // Try native Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${listing.produceName} - Mandi Mitra`,
          text: shareText,
          url: window.location.origin
        });
        return true;
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return false; // User cancelled
        }
        console.error('Share failed:', error);
      }
    }

    // Fallback to WhatsApp
    this.shareViaWhatsApp(shareText);
    return true;
  },

  /**
   * Share via WhatsApp
   */
  shareViaWhatsApp(text: string) {
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  },

  /**
   * Share via SMS
   */
  shareViaSMS(text: string, phoneNumber?: string) {
    const encodedText = encodeURIComponent(text);
    const smsUrl = phoneNumber 
      ? `sms:${phoneNumber}?body=${encodedText}`
      : `sms:?body=${encodedText}`;
    window.location.href = smsUrl;
  },

  /**
   * Copy to clipboard
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Copy failed:', error);
      return false;
    }
  }
};
