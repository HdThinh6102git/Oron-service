import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../providers';
import { BaseApiResponse } from '../../shared/dtos';
import { AdminOutput, CreateAdminInput } from '../dtos';

@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async createNewAdmin(
    @Body() body: CreateAdminInput,
  ): Promise<BaseApiResponse<AdminOutput>> {
    return await this.userService.createNewAdmin(body);
  }
}
