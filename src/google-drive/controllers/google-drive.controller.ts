import { BadRequestException, Body, Controller, Delete, HttpException, HttpStatus, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { GoogleDriveService } from "../providers";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import { UploadSpecificFileInput } from "../dtos";
import { FileService } from "src/shared/providers";
import { JwtAuthGuard } from "src/auth/guards";
import { ReqContext, RequestContext } from "src/shared/request-context";
import { CreateFileInput, CreateFileRelatedMorphInput } from "src/shared/dtos";
import { RELATED_TYPE } from "#entity/file";

@Controller('google-drive')
export class GoogleDriveController {
  constructor(
    private googleDriveService: GoogleDriveService,
    private fileService: FileService
  ) {}

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


  @Post('/specific')
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
      fileFilter: (req, file, cb) => {
        const allowedExtArr = ['.jpg', '.png', '.jpeg', '.JPG', '.PNG', '.JPEG','.webp', '.WEBP'];
        const ext = path.extname(file.originalname);
        const fileSize = parseInt(req.headers['content-length'], 10);
  
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file extensions are: ${allowedExtArr.join(', ')}`;
          cb(null, false);
        } else if (fileSize > 1024 * 1024 * 5) {
          req.fileValidationError = `File size is too large. Accepted file size is less than 5 MB`;
          cb(null, false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  @UseGuards(JwtAuthGuard)
  public async uploadFileOfSpecificItem(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadSpecificFileInput,
    @Req() req: any,
    @ReqContext() ctx: RequestContext,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    // Validate input
    if (!body.relatedType) {
      throw new Error('relatedType is required.');
    }
  
    // Define parent folder name
    const parentFolderName = 'oron-service-upload';
  
    // Ensure parent folder exists or create it
    await this.googleDriveService.ensureFolder(parentFolderName);
  
    // Define child folder name based on relatedType
    let childFolderName: string | null = null;
  
    switch (body.relatedType) {
      case RELATED_TYPE.POST_IMAGE:
        childFolderName = RELATED_TYPE.POST_IMAGE;
        break;
      case RELATED_TYPE.USER_PROFILE:
        childFolderName = RELATED_TYPE.USER_PROFILE;
        break;
      case RELATED_TYPE.USER_BACKGROUND:
        childFolderName = RELATED_TYPE.USER_BACKGROUND;
        break;
      case RELATED_TYPE.ADVERTISEMENT_BANNER:
        childFolderName = RELATED_TYPE.ADVERTISEMENT_BANNER;
        break;
      default:
        throw new Error(`Invalid relatedType: ${body.relatedType}`);
    }
  
    if (!childFolderName) {
      throw new Error('Child folder name could not be determined.');
    }
  
    //Ensure child folder exists or create it under the parent folder
    const childFolderId = await this.googleDriveService.ensureFolder(parentFolderName, childFolderName);
  
    if (!childFolderId) {
      throw new Error(`Failed to create or find child folder: ${childFolderName}`);
    }
  
    // Upload the file to the child folder
    const uploadedFile = await this.googleDriveService.uploadFile(file, childFolderId);
    
    //Validate related id data

    //Init file input
    let fileInput = new CreateFileInput();
    fileInput.id = uploadedFile.id;
    fileInput.name = uploadedFile.name;
    fileInput.url = uploadedFile.thumbnailLink;
    fileInput.alternativeText = body.alternativeText;

    
    // Init fileRelatedMorph input
    let fileRelatedMorphInput = new CreateFileRelatedMorphInput();
    fileRelatedMorphInput.relatedRid = body.relatedId;
    fileRelatedMorphInput.relatedType = body.relatedType;
    fileRelatedMorphInput.fileRid = uploadedFile.id;
    
    //Save data to database
    await this.fileService.createNewFile(ctx.user.id, fileInput, fileRelatedMorphInput);

    // Return response
    return {
      message: `File uploaded successfully to Google Drive folder: ${childFolderName}`,
      fileDetails: uploadedFile,
    };
  }

}