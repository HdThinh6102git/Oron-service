import {  Injectable } from "@nestjs/common";
import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
@Injectable()
export class GoogleDriveService {
    private driveClient: drive_v3.Drive;
    constructor() {
      // Load credentials from JSON file
      const CLIENT_ID = process.env['CLIENT_ID'];
      const CLIENT_SECRET = process.env['CLIENT_SECRET'];
      const REDIRECT_URI = process.env['REDIRECT_URI'];
      const REFRESH_TOKEN = process.env['REFRESH_TOKEN'];
  
      const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  
      // Set the refresh token
      oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
      this.driveClient = google.drive({ version: 'v3', auth: oauth2Client });
    }


    // create folder if not exist
    async ensureFolderBackup(parentFolderName: string): Promise<string> {
      try {
        // find folder based on name
        const response = await this.driveClient.files.list({
          q: `mimeType='application/vnd.google-apps.folder' and name='${parentFolderName}' and trashed=false`,
          fields: 'files(id, name)',
          spaces: 'drive',
        });

        const folder = response.data.files?.[0];
        if (folder) {
          if (!folder.id) {
            throw new Error('Failed to create folder: Folder ID is undefined');
          }
          //Return folder id if exist
          return folder.id;
          
        }

        //create new folder if not exist
        const createResponse = await this.driveClient.files.create({
          requestBody: {
            name: parentFolderName,
            mimeType: 'application/vnd.google-apps.folder',
          },
          fields: 'id',
        });

        const newFolderId = createResponse.data.id;
        if (!newFolderId) {
          throw new Error('Failed to create folder: Folder ID is undefined');
        }
        //return new folder id
        return newFolderId;
        
      } catch (error) {
        console.error('Error ensuring folder:', error);
        throw error;
      }
    }

    async ensureFolder(parentFolderName: string, childFolderName: string = ''): Promise<string> {
      try {
        // Step 1: Handle Case 01: parentFolderName only
        if (parentFolderName && !childFolderName) {
          const parentFolderId = await this.findOrCreateFolder(parentFolderName);
          return parentFolderId;
        }
    
        // Step 2: Handle Case 02: parentFolderName and childFolderName
        if (parentFolderName && childFolderName) {
          // Find or create parent folder
          const parentFolderId = await this.findOrCreateFolder(parentFolderName);
    
          // Find child folder within the parent folder
          const childFolderId = await this.findFolderInParent(childFolderName, parentFolderId);
    
          if (childFolderId) {
            return childFolderId; // Return child folder ID if it exists
          }
    
          // Create new child folder in the parent folder
          const newChildFolderId = await this.createFolder(childFolderName, parentFolderId);
          return newChildFolderId;
        }
    
        throw new Error('Invalid parameters: parentFolderName is required.');
    
      } catch (error) {
        console.error('Error ensuring folder:', error);
        throw error;
      }
    }

    private async findOrCreateFolder(folderName: string): Promise<string> {
      const response = await this.driveClient.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
        fields: 'files(id, name)',
        spaces: 'drive',
      });
    
      const folder = response.data.files?.[0];
      if (folder?.id) {
        return folder.id; // Return folder ID if it exists
      }
    
      // Create a new folder if not found
      const createResponse = await this.driveClient.files.create({
        requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
        },
        fields: 'id',
      });
    
      const newFolderId = createResponse.data.id;
      if (!newFolderId) {
        throw new Error('Failed to create folder: Folder ID is undefined');
      }
    
      return newFolderId; // Return new folder ID
    }

    private async findFolderInParent(folderName: string, parentFolderId: string): Promise<string | null> {
      const response = await this.driveClient.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${parentFolderId}' in parents and trashed=false`,
        fields: 'files(id, name)',
        spaces: 'drive',
      });
    
      const folder = response.data.files?.[0];
      return folder?.id || null; // Return folder ID or null if not found
    }

    private async createFolder(folderName: string, parentFolderId: string): Promise<string> {
      const createResponse = await this.driveClient.files.create({
        requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentFolderId],
        },
        fields: 'id',
      });
    
      const newFolderId = createResponse.data.id;
      if (!newFolderId) {
        throw new Error('Failed to create folder: Folder ID is undefined');
      }
    
      return newFolderId; // Return new folder ID
    }

    public async uploadFile(
      file: Express.Multer.File,
      folderId: string
    ): Promise<any> {
        const fileMetadata = {
          name: file.originalname, // File name to be displayed in Google Drive
          parents: [folderId], // Đặt file vào thư mục
        };

        const media = {
          mimeType: file.mimetype,
          body: fs.createReadStream(file.path), // Stream the file from local storage
        };

        try {
          const response = await this.driveClient.files.create({
            requestBody: fileMetadata,
            media,
            fields: 'id, name,  webViewLink, webContentLink, thumbnailLink',
          });
          if(response.data.id){
            await this.setFilePermissions(response.data.id);
          }
          if (response.data.thumbnailLink) {
            const resizedThumbnailLink = response.data.thumbnailLink.replace(/=s\d+/, '=w2000-h2000');
            response.data.thumbnailLink = resizedThumbnailLink;
          }
    
          // Optionally delete the file from local storage after upload
          fs.unlinkSync(file.path);
    
          return response.data;
        } catch (error) {
          console.error('Error uploading file to Google Drive:', error);
          throw error;
        }
        
    }

    async setFilePermissions(fileId: string) {
      const CLIENT_ID = process.env['CLIENT_ID'];
      const CLIENT_SECRET = process.env['CLIENT_SECRET'];
      const REDIRECT_URI = process.env['REDIRECT_URI'];
      const REFRESH_TOKEN = process.env['REFRESH_TOKEN'];
    
      const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
      oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
      try {
        // Thêm quyền chia sẻ cho file
        await drive.permissions.create({
          fileId,
          requestBody: {
            role: 'reader', // Quyền đọc
            type: 'anyone', // Chia sẻ công khai
          },
        });
    
        console.log('Permissions updated successfully');
      } catch (error) {
        console.error('Error setting permissions:', error);
      }
    }


    // Hàm xóa file
    async deleteFile(fileId: string): Promise<void> {
      try {
        await this.driveClient.files.delete({ fileId });
        console.log(`File with ID ${fileId} has been deleted successfully.`);
      } catch (error) {
        console.error(`Failed to delete file with ID ${fileId}:`, error);
        throw error;
      }
    }
    
}