import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CategoryFilter,
  CategoryOutput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../dtos';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import { CategoryService } from '../providers';
import { JwtAdminAuthGuard } from '../../auth/guards';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Post()
  @UseGuards(JwtAdminAuthGuard)
  public async createNewCategory(
    @Body() body: CreateCategoryInput,
  ): Promise<BaseApiResponse<CategoryOutput>> {
    return await this.categoryService.createNewCategory(body);
  }

  @Patch(':id')
  @UseGuards(JwtAdminAuthGuard)
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

  @Delete(':id')
  @UseGuards(JwtAdminAuthGuard)
  public async deleteCategory(
    @Param('id') categoryId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.categoryService.deleteCategory(categoryId);
  }

  @Delete('permanently/:id')
  @UseGuards(JwtAdminAuthGuard)
  public async deleteCategoryPermanently(
    @Param('id') categoryId: string,
  ): Promise<BaseApiResponse<null>> {
    return this.categoryService.deleteCategoryPermanently(categoryId);
  }

  @Patch('restoration/:id')
  @UseGuards(JwtAdminAuthGuard)
  public async retoreCategory(
    @Param('id') categoryId: string,
  ): Promise<BaseApiResponse<CategoryOutput>> {
    return await this.categoryService.restoreCategory(categoryId);
  }
}
