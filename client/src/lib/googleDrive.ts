/**
 * Google Drive API Service (Client-Side)
 * Handles file uploads through server API using service account
 */

interface GoogleDriveFile {
    id: string;
    name: string;
    mimeType: string;
    createdTime: string;
    size: string;
}

interface UploadResponse {
    fileId: string;
    fileName: string;
    fileSize?: string;
}

/**
 * Upload a file to Google Drive via server API
 */
export async function uploadToGoogleDrive(
    file: File,
    fileName?: string
): Promise<UploadResponse> {
    try {
        // Convert file to base64
        const fileContent = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        // Upload via server API
        const response = await fetch('/api/files/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fileName: fileName || file.name,
                mimeType: file.type,
                fileContent,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to upload file to Google Drive');
        }

        const result = await response.json();

        return {
            fileId: result.id,
            fileName: result.name,
            fileSize: result.size,
        };
    } catch (error) {
        console.error('Error uploading to Google Drive:', error);
        throw error;
    }
}

/**
 * Download a file from Google Drive
 * Note: This now returns the webViewLink instead of blob
 */
export async function downloadFromGoogleDrive(
    fileId: string
): Promise<string> {
    // Return the Google Drive view link
    return `https://drive.google.com/file/d/${fileId}/view`;
}

/**
 * Delete a file from Google Drive via server API
 */
export async function deleteFromGoogleDrive(
    fileId: string
): Promise<void> {
    try {
        const response = await fetch(`/api/files/${fileId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete file from Google Drive');
        }
    } catch (error) {
        console.error('Error deleting from Google Drive:', error);
        throw error;
    }
}

/**
 * Check if a file is stored in Google Drive (vs Supabase)
 */
export function isGoogleDriveFile(fileReference: string): boolean {
    // Google Drive file IDs are typically alphanumeric strings
    // Supabase URLs contain 'supabase' or are base64 encoded
    return !fileReference.includes('supabase') &&
        !fileReference.startsWith('data:') &&
        fileReference.length < 100; // Drive IDs are usually ~40 chars
}
