import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CategoryFilter,
  CategoryOutput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../dtos';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
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

  @Get('/filter')
  public async getAllCategories(
    @Query() query: CategoryFilter,
  ): Promise<BasePaginationResponse<CategoryOutput>> {
    return this.categoryService.getAllCategories(query);
  }

  @Get(':id')
  public async getCategoryById(
    @Param('id') categoryId: string,
  ): Promise<BaseApiResponse<CategoryOutput>> {
    return await this.categoryService.getCategoryById(categoryId);
  }
}
