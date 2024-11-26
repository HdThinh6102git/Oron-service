import { Controller, Post } from "@nestjs/common";
import { GoogleDriveService } from "../providers";

@Controller('google-drive')
export class GoogleDriveController {
  constructor(private googleDriveService: GoogleDriveService) {}

  @Post()
  public async uploadFile(
  ): Promise<void> {
    await this.googleDriveService.uploadFile();
  }

}