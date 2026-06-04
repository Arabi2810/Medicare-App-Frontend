const CLOUDINARY_CLOUD_NAME = 'dyz0z2xw';
const CLOUDINARY_UPLOAD_PRESET = 'medicare';

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export const uploadToCloudinary = async (
  fileUri: string,
  folder: string = 'prescriptions'
): Promise<CloudinaryResponse> => {
  const formData = new FormData();

  const filename = fileUri.split('/').pop() || 'image.jpg';
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  const mimeType = ext === 'png' ? 'image/png' :
    ext === 'pdf' ? 'application/pdf' : 'image/jpeg';

  formData.append('file', {
    uri: fileUri,
    type: mimeType,
    name: filename,
  } as any);

  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Cloudinary upload failed');
  }

  const data = await response.json();
  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
  };
};