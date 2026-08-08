const cloudinary = require('../config/cloudinary');

/**
 * Extract the Cloudinary public_id from a full secure URL.
 * e.g. "https://res.cloudinary.com/dz3yaj24a/image/upload/v1234567890/codewithbpmce/1234-photo.jpg"
 *   → "codewithbpmce/1234-photo"
 */
function extractPublicId(url) {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    // Remove everything up to and including "/upload/"
    const afterUpload = url.split('/upload/')[1];
    if (!afterUpload) return null;
    // Remove version prefix if present (e.g. "v1234567890/")
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    // Remove file extension
    const publicId = withoutVersion.replace(/\.[^.]+$/, '');
    return publicId;
  } catch (_) {
    return null;
  }
}

/**
 * Delete an image from Cloudinary by its URL.
 * Silently fails if URL is invalid or deletion errors.
 */
async function deleteCloudinaryImage(url) {
  const publicId = extractPublicId(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('[Cloudinary] Failed to delete image:', publicId, err.message);
  }
}

module.exports = { extractPublicId, deleteCloudinaryImage };
