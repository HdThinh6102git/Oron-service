import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseApiResponse } from '../../shared/dtos';
import { CategoryOutput, CreateCategoryInput } from '../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '#entity/post/category.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { MESSAGES } from '../../shared/constants';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}
  public async createNewCategory(
    input: CreateCategoryInput,
  ): Promise<BaseApiResponse<CategoryOutput>> {
    const categoryExist = await this.categoryRepo.findOne({
      where: { name: input.name },
    });
    if (categoryExist) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.CATEGORY_NAME_EXIST,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const category = await this.categoryRepo.save(input);
    const categoryOutput = plainToInstance(CategoryOutput, category);
    return {
      error: false,
      data: categoryOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }
}
