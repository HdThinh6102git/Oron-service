import { Injectable } from "@nestjs/common";

@Injectable()
export class GoogleDriveService {

    public async uploadFile(
      ): Promise<void> {
        console.log("hello world");
    }
}