import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseApiResponse } from '../../shared/dtos';
import {
  CategoryOutput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '#entity/post/category.entity';
import { In, Not, Repository } from 'typeorm';
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

  public async updateCategory(
    input: UpdateCategoryInput,
    categoryId: string,
  ): Promise<BaseApiResponse<CategoryOutput>> {
    if (input.name) {
      const categoryNameExist = await this.categoryRepo.findOne({
        where: { id: Not(In([categoryId])), name: input.name },
      });
      if (categoryNameExist) {
        throw new HttpException(
          {
            error: true,
            message: MESSAGES.CATEGORY_NAME_EXIST,
            code: 4,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const categoryIdExist = await this.categoryRepo.findOne({
      where: {
        id: categoryId,
      },
    });
    if (!categoryIdExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.CATEGORY_NOT_FOUND,
        code: 4,
      });
    }
    if (input.name) {
      categoryIdExist.name = input.name;
    }
    if (input.description) {
      categoryIdExist.description = input.description;
    }

    const category = await this.categoryRepo.save(categoryIdExist);
    const categoryOutput = plainToInstance(CategoryOutput, category, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: categoryOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }
}
