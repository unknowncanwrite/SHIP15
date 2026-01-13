import { uploadFileToDrive, deleteFileFromDrive, getGoogleDriveClient } from './google-drive';

export async function uploadFile(
  fileName: string,
  mimeType: string,
  fileContent: string
): Promise<{ id: string; name: string; webViewLink: string }> {
  return uploadFileToDrive(fileName, mimeType, fileContent);
}

export async function deleteFile(fileId: string): Promise<void> {
  return deleteFileFromDrive(fileId);
}

export async function getFile(fileId: string): Promise<{ name: string; mimeType: string; data: Buffer }> {
  const drive = await getGoogleDriveClient();

  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'arraybuffer' }
  );

  const metadata = await drive.files.get({ fileId, fields: 'name,mimeType' });

  return {
    name: metadata.data.name || 'unknown',
    mimeType: metadata.data.mimeType || 'application/octet-stream',
    data: Buffer.from(response.data as ArrayBuffer),
  };
}
