class CloudinaryService {
  /**
   * Uploads an image file and returns the hosted URL.
   */
  async uploadImage(file: File): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network

    // In production, use formData and fetch to Cloudinary API
    console.log(`Uploaded ${file.name} (${file.size} bytes)`);
    
    // For demo: Create a local object URL from the actual uploaded file
    // This displays the real image the user selected
    return URL.createObjectURL(file);
  }
}

export const cloudinaryService = new CloudinaryService();