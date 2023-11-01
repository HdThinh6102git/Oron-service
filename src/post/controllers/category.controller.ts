import { Body, Controller, Post } from '@nestjs/common';
import { CategoryOutput, CreateCategoryInput } from '../dtos';
import { BaseApiResponse } from '../../shared/dtos';
import { CategoryService } from '../providers';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Post()
  public async createNewCategory(
    @Body() body: CreateCategoryInput,
  ): Promise<BaseApiResponse<CategoryOutput>> {
    return await this.categoryService.createNewCategory(body);
  }
}
