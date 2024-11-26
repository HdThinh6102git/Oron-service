import { Controller, Delete, HttpException, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { GoogleDriveService } from "../providers";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";

@Controller('google-drive')
export class GoogleDriveController {
  constructor(private googleDriveService: GoogleDriveService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          console.log(req)
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File
  ) {
    // Tên thư mục cần kiểm tra hoặc tạo
    const folderName = 'oron-service-upload';

    // Đảm bảo thư mục tồn tại
    const folderId = await this.googleDriveService.ensureFolder(folderName);

    // Upload file vào thư mục
    const uploadedFile = await this.googleDriveService.uploadFile(file, folderId);
    return {
      message: 'File uploaded successfully to Google Drive',
      fileDetails: uploadedFile,
    };
  }

  @Delete('/:fileId')
    async deleteFile(@Param('fileId') fileId: string) {
      try {
        await this.googleDriveService.deleteFile(fileId);
        return {
          message: `File with ID ${fileId} has been deleted successfully.`,
        };
      } catch (error) {
        throw new HttpException(
          `Failed to delete file with ID ${fileId}: ${error}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
  }

}