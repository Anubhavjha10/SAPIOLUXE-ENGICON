/**
 * Utility functions for handling Google Drive file links
 */

export function extractGoogleDriveFileId(url: string): string | null {
  if (!url) return null;
  
  // Pattern 1: /file/d/FILE_ID/ or /d/FILE_ID/ or /d/FILE_ID
  const matchFileD = url.match(/\/(?:file\/)?d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) {
    return matchFileD[1];
  }

  // Pattern 2: ?id=FILE_ID or &id=FILE_ID
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) {
    return matchId[1];
  }

  return null;
}

export function getDrivePreviewUrl(url: string): string {
  if (!url) return '';
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
}

export function getDriveDownloadUrl(url: string): string {
  if (!url) return '';
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
}
