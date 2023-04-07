import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const removeFile = async (filePath: string): Promise<void> => {
  try {
    await promisify(fs.unlink)(filePath);
  } catch (err) {
    throw new Error(`Failed to remove file: ${err.message}`);
  }
};

const getFileNameFromUrl = (url: string): string => {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
};

class FileHandler {
  constructor() {}

  async removeFile(filePath: string): Promise<void> {
    await removeFile(filePath);
  }

  getFileNameFromUrl(url: string): string {
    return getFileNameFromUrl(url);
  }

  async removeFileAndGetFileName(url: string): Promise<string> {
    const fileName = this.getFileNameFromUrl(url);
    const filePath = path.join(__dirname, 'path/to/files', fileName);
    await this.removeFile(filePath);
    return fileName;
  }
}
