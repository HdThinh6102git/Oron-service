import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilePictureInputDto } from '../dtos';
import * as path from 'path';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { MESSAGES, TYPE_PIC } from '../constants';
import { UserService } from '../../user/providers';
import { JwtAuthGuard } from '../../auth/guards';
import { ReqContext, RequestContext } from '../request-context';

@Controller('picture')
export class UploadFileController {
  constructor(private readonly userService: UserService) {}
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomFileName = `${Math.floor(
            100000 + Math.random() * 900000,
          )}-${file.originalname}`;
          cb(null, randomFileName);
          console.log(req);
        },
      }),
    }),
  )
  @Post('upload/local')
  async uploadPictureLocal(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return {
      error: false,
      data: {
        fileName: file.filename,
      },
      message: MESSAGES.UPLOADED_SUCCEED,
      code: 0,
    };
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/user-profile',
        filename: (req, file, cb) => {
          const randomFileName = `${Math.floor(
            100000 + Math.random() * 900000,
          )}-${file.originalname}`;
          cb(null, randomFileName);
          console.log(req);
        },
      }),
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Post('upload/user-profile')
  async uploadUserProfilePicture(
    @UploadedFile()
    file: Express.Multer.File,
    @ReqContext() ctx: RequestContext,
  ) {
    return await this.userService.updateProfileImgUrl(
      TYPE_PIC.PROFILE,
      file.filename,
      ctx.user.id,
    );
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/user-background',
        filename: (req, file, cb) => {
          const randomFileName = `${Math.floor(
            100000 + Math.random() * 900000,
          )}-${file.originalname}`;
          cb(null, randomFileName);
          console.log(req);
        },
      }),
    }),
  )
  @Post('upload/user-background')
  @UseGuards(JwtAuthGuard)
  async uploadUserBackgroundPicture(
    @UploadedFile()
    file: Express.Multer.File,
    @ReqContext() ctx: RequestContext,
  ) {
    return await this.userService.updateProfileImgUrl(
      TYPE_PIC.BACKGROUND,
      file.filename,
      ctx.user.id,
    );
  }

  @Get()
  getPicture(@Res() res: Response, @Body() file: FilePictureInputDto) {
    res.sendFile(path.join(__dirname, '../../../uploads/' + file.fileName));
  }

  @Get('user-profile')
  @UseGuards(JwtAuthGuard)
  getUserProfilePicture(
    @Res() res: Response,
    @Body() file: FilePictureInputDto,
  ) {
    res.sendFile(
      path.join(__dirname, '../../../uploads/user-profile/' + file.fileName),
    );
  }

  @Get('user-background')
  @UseGuards(JwtAuthGuard)
  getUserBackgroundPicture(
    @Res() res: Response,
    @Body() file: FilePictureInputDto,
  ) {
    res.sendFile(
      path.join(__dirname, '../../../uploads/user-background/' + file.fileName),
    );
  }
}
