class CloudinaryService {
  /**
   * Uploads an image file and returns the hosted URL.
   */
  async uploadImage(file: File): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network

    // Return a mock URL based on file type just for visual feedback in the demo
    // In production, use formData and fetch to Cloudinary API
    console.log(`Uploaded ${file.name} (${file.size} bytes)`);
    
    // Return a random Unsplash image to simulate a successful upload of produce
    const mockImages = [
      "https://images.unsplash.com/photo-1518977676658-231aee933c91?w=400&h=300&fit=crop", // Wheat
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop", // Rice
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=300&fit=crop", // Onion
      "https://images.unsplash.com/photo-1596522512682-1c258eb23e0c?w=400&h=300&fit=crop", // Chilli
      "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400&h=300&fit=crop"  // Vegetables
    ];
    
    return mockImages[Math.floor(Math.random() * mockImages.length)];
  }
}

export const cloudinaryService = new CloudinaryService();