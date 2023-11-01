import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import {
  CategoryOutput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../dtos';
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
  @Patch(':id')
  public async updateCategory(
    @Param('id') categoryId: string,
    @Body() body: UpdateCategoryInput,
  ): Promise<BaseApiResponse<CategoryOutput>> {
    return await this.categoryService.updateCategory(body, categoryId);
  }
}
