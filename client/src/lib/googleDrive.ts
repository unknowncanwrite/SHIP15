/**
 * Google Drive API Service
 * Handles all interactions with Google Drive for document storage
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
    fileSize: string;
}

const GOOGLE_DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const GOOGLE_DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

/**
 * Upload a file to Google Drive
 */
export async function uploadToGoogleDrive(
    file: File,
    accessToken: string
): Promise<UploadResponse> {
    try {
        // Create metadata
        const metadata = {
            name: file.name,
            mimeType: file.type,
            // Store in a dedicated folder for the app (optional)
            // parents: ['folderId'] // We can create an app folder later if needed
        };

        // Create form data for multipart upload
        const form = new FormData();
        form.append(
            'metadata',
            new Blob([JSON.stringify(metadata)], { type: 'application/json' })
        );
        form.append('file', file);

        // Upload file
        const response = await fetch(
            `${GOOGLE_DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id,name,size`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: form,
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to upload file to Google Drive');
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
 */
export async function downloadFromGoogleDrive(
    fileId: string,
    accessToken: string
): Promise<Blob> {
    try {
        const response = await fetch(
            `${GOOGLE_DRIVE_API_BASE}/files/${fileId}?alt=media`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to download file from Google Drive');
        }

        return await response.blob();
    } catch (error) {
        console.error('Error downloading from Google Drive:', error);
        throw error;
    }
}

/**
 * Get file metadata from Google Drive
 */
export async function getFileMetadata(
    fileId: string,
    accessToken: string
): Promise<GoogleDriveFile> {
    try {
        const response = await fetch(
            `${GOOGLE_DRIVE_API_BASE}/files/${fileId}?fields=id,name,mimeType,createdTime,size`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to get file metadata');
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting file metadata:', error);
        throw error;
    }
}

/**
 * Delete a file from Google Drive (moves to trash)
 */
export async function deleteFromGoogleDrive(
    fileId: string,
    accessToken: string
): Promise<void> {
    try {
        const response = await fetch(
            `${GOOGLE_DRIVE_API_BASE}/files/${fileId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to delete file from Google Drive');
        }
    } catch (error) {
        console.error('Error deleting from Google Drive:', error);
        throw error;
    }
}

/**
 * Get Google access token from Supabase session
 */
export async function getGoogleAccessToken(): Promise<string | null> {
    try {
        // This will be implemented with Supabase auth
        // For now, return null - will be updated after Supabase config
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.provider_token) {
            throw new Error('No Google access token found. Please sign in with Google.');
        }

        return session.provider_token;
    } catch (error) {
        console.error('Error getting Google access token:', error);
        return null;
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
