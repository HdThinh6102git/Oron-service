import {
  BadRequestException,
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';
import { TYPE_PIC } from '../constants';
import { UserService } from '../../user/providers';
import { JwtAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../request-context';
import { PostService } from '../../post/providers';

@Controller('picture')
export class UploadFileController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/user-profile',
        filename: (req, file, cb) => {
          const randomFileName = `${Date.now()}-${file.originalname}`;
          cb(null, randomFileName);
          console.log(req.baseUrl);
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const allowedExtArr = [
          '.jpg',
          '.png',
          '.jpeg',
          '.JPG',
          '.PNG',
          '.JPEG',
        ];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are : ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `File size is too large. Accepted file size is less than 5 MB`;
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Post('upload/user-profile')
  async uploadUserProfilePicture(
    @Req() req: any,
    @UploadedFile()
    file: Express.Multer.File,
    @ReqContext() ctx: RequestContext,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return await this.userService.updateProfileImgUrl(
      TYPE_PIC.PROFILE,
      `user-profile/${file.filename}`,
      ctx.user.id,
    );
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/user-background',
        filename: (req, file, cb) => {
          const randomFileName = `${Date.now()}-${file.originalname}`;
          cb(null, randomFileName);
          console.log(req.baseUrl);
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const allowedExtArr = [
          '.jpg',
          '.png',
          '.jpeg',
          '.JPG',
          '.PNG',
          '.JPEG',
        ];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are : ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `File size is too large. Accepted file size is less than 5 MB`;
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  @Post('upload/user-background')
  @UseGuards(JwtAuthGuard)
  async uploadUserBackgroundPicture(
    @Req() req: any,
    @UploadedFile()
    file: Express.Multer.File,
    @ReqContext() ctx: RequestContext,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return await this.userService.updateProfileImgUrl(
      TYPE_PIC.BACKGROUND,
      `user-background/${file.filename}`,
      ctx.user.id,
    );
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/post',
        filename: (req, file, cb) => {
          const randomFileName = `${Date.now()}-${file.originalname}`;
          cb(null, randomFileName);
          console.log(req.baseUrl);
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const allowedExtArr = [
          '.jpg',
          '.png',
          '.jpeg',
          '.JPG',
          '.PNG',
          '.JPEG',
        ];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are : ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `File size is too large. Accepted file size is less than 5 MB`;
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Post('upload/post/:id')
  async uploadPostPicture(
    @Req() req: any,
    @UploadedFile()
    file: Express.Multer.File,
    @ReqContext() ctx: RequestContext,
    @Param('id') postId: string,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return await this.postService.updateImgUrl(
      `post/${file.filename}`,
      ctx.user.id,
      postId,
    );
  }
}
