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


    // Kiểm tra và tạo thư mục nếu cần
    async ensureFolder(folderName: string): Promise<string> {
      try {
        // Tìm thư mục theo tên
        const response = await this.driveClient.files.list({
          q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
          fields: 'files(id, name)',
          spaces: 'drive',
        });

        const folder = response.data.files?.[0];
        if (folder) {
          if (!folder.id) {
            throw new Error('Failed to create folder: Folder ID is undefined');
          }
          console.log(`Folder "${folderName}" already exists with ID: ${folder.id}`);
          
          return folder.id;
          
        }

        // Nếu không tìm thấy, tạo thư mục mới
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
    
        console.log(`Folder "${folderName}" created with ID: ${newFolderId}`);
        return newFolderId;
        
      } catch (error) {
        console.error('Error ensuring folder:', error);
        throw error;
      }
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
            fields: 'id, name, webViewLink, webContentLink',
          });
          if(response.data.id){
            await this.setFilePermissions(response.data.id);
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