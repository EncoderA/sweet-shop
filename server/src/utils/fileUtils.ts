import fs from 'fs';
import path from 'path';

export function ensureDirectoryExists(targetPath: string): void {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
}

export function resolveUploadsImagesDir(currentDir: string): string {
  // From any server/src/* file, resolve to server/uploads/images
  return path.resolve(currentDir, '..', '..', 'uploads', 'images');
}


