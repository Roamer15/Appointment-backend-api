import imageCompression from 'browser-image-compression';

export async function compressImage(file) {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 500,
    useWebWorker: true,
  };
  return await imageCompression(file, options);
}

export function isValidImage(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  return validTypes.includes(file.type);
}
