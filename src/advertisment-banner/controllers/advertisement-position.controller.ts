import { Controller, Post } from "@nestjs/common";
import { AdvertisementPositionService } from "../providers";

@Controller('advertisement-position')
export class AdvertisementPositionController {
  constructor(private advertisementPositionService: AdvertisementPositionService) {}

  @Post()
  @UseGuards(JwtAdminAuthGuard)
  public async createNewCategory(
    @Body() body: CreateCategoryInput,
  ): Promise<BaseApiResponse<CategoryOutput>> {
    return await this.categoryService.createNewCategory(body);
  }
}