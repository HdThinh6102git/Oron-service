import { Controller } from "@nestjs/common";
import { AdvertisementBannerService } from "../providers";


@Controller('advertisement-banner')
export class AdvertisementBannerController {
  constructor(private advertisementBannerService: AdvertisementBannerService) {}
}