const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_RAW_IMAGE_MB = 15;
const MAX_VIDEO_MB = 150;

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/') && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Please select a valid image file (JPG, PNG, or WebP).';
  }
  if (file.size > MAX_RAW_IMAGE_MB * 1024 * 1024) {
    return `Image "${file.name}" exceeds ${MAX_RAW_IMAGE_MB}MB limit.`;
  }
  return null;
}

export function validateVideoFile(file: File): string | null {
  if (!file.type.startsWith('video/')) {
    return 'Please select a valid video file (MP4, WebM, MOV).';
  }
  if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
    return `Video "${file.name}" exceeds ${MAX_VIDEO_MB}MB limit.`;
  }
  return null;
}

/**
 * Resizes and compresses an uploaded image client-side before uploading to Firebase Storage
 * (or storing in preview mode), preserving crispness while speeding up mobile uploads.
 */
export async function optimizeImageForUpload(
  file: File,
  maxDimension = 1600,
  quality = 0.84
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => resolve(file);
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else resolve(file);
          },
          'image/jpeg',
          quality
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not convert file to data URL'));
    reader.readAsDataURL(blob);
  });
}

export function extractYouTubeId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

