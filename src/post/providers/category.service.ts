import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  CategoryFilter,
  CategoryOutput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '#entity/post/category.entity';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { MESSAGES } from '../../shared/constants';
import { isEmpty } from '@nestjs/common/utils/shared.utils';

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
    if (input.status) {
      categoryIdExist.status = input.status;
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
  public async getAllCategories(
    filter: CategoryFilter,
  ): Promise<BasePaginationResponse<CategoryOutput>> {
    let wheres: any[] = [];
    const where: any = {
      id: Not(IsNull()),
    };
    if (typeof filter.status === 'number') {
      where['status'] = filter.status;
    }
    if (filter.keyword) {
      wheres = [
        {
          ...where,
          name: ILike(`%${filter.keyword}%`),
        },
        {
          ...where,
          description: ILike(`%${filter.keyword}%`),
        },
      ];
    }
    if (isEmpty(wheres)) {
      wheres.push(where);
    }
    const categories = await this.categoryRepo.find({
      where: wheres,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
    });
    const count = await this.categoryRepo.count({
      where: wheres,
      order: {
        createdAt: 'DESC',
      },
    });
    const categoriesOutput = plainToInstance(CategoryOutput, categories, {
      excludeExtraneousValues: true,
    });
    return {
      listData: categoriesOutput,
      total: count,
    };
  }

  public async getCategoryById(
    categoryId: string,
  ): Promise<BaseApiResponse<CategoryOutput>> {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.CATEGORY_NOT_FOUND,
        code: 4,
      });
    }
    const categoryOutput = plainToClass(CategoryOutput, category, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: categoryOutput,
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }

  public async deleteCategory(
    categoryId: string,
  ): Promise<BaseApiResponse<null>> {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.CATEGORY_NOT_FOUND,
        code: 4,
      });
    }
    category.deletedAt = new Date();
    await this.categoryRepo.save(category);
    return {
      error: false,
      data: null,
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }
}
