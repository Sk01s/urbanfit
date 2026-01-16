/**
 * @deprecated This file is deprecated. Use the backend API endpoint for file uploads instead.
 * Direct Backblaze B2 uploads from the frontend expose credentials.
 * All uploads should go through the backend /api/upload endpoint.
 * 
 * This file is kept for backwards compatibility but will be removed in a future version.
 */

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";

class BackblazeB2Service {
  constructor() {
    console.warn(
      "DEPRECATED: Direct Backblaze B2 service is deprecated. Use the backend /api/upload endpoint instead."
    );
  }

  async uploadFile(fileBuffer, fileName, contentType) {
    console.warn(
      "DEPRECATED: Use the backend /api/upload endpoint for file uploads."
    );
    throw new Error(
      "Direct B2 uploads are no longer supported. Use the backend API endpoint."
    );
  }

  async uploadFileFromUrl(fileUrl, fileName, contentType) {
    console.warn(
      "DEPRECATED: Use the backend /api/upload endpoint for file uploads."
    );
    throw new Error(
      "Direct B2 uploads are no longer supported. Use the backend API endpoint."
    );
  }

  async deleteFile(fileId) {
    console.warn(
      "DEPRECATED: Use the backend API for file operations."
    );
    throw new Error(
      "Direct B2 operations are no longer supported. Use the backend API."
    );
  }

  getPublicUrl(fileName) {
    // This can still work as it's just URL construction
    const bucketName = "urbanfitMediaBucket";
    return `https://f002.backblazeb2.com/file/${bucketName}/${fileName}`;
  }
}

export default new BackblazeB2Service();