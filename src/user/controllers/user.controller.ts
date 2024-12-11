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
import { ReqContext, RequestContext } from '@modules/shared/request-context';
import {
  BaseApiResponse,
  BasePaginationResponse,
  TopUserPaginationResponse,
} from '@modules/shared/dtos';
import {
  ChangePasswordDto,
  FriendFilter,
  TopUserFilter,
  TopUserOutput,
  UpdateUserInput,
  UpdateUserStatusInput,
  UserFilter,
  UserOutputDto,
  UserProfileOutput,
} from '@modules/user/dtos';
import { UserService } from '@modules/user/providers';
import { JwtAuthGuard, JwtCommonAuthGuard, JwtAdminAuthGuard } from '@modules/auth/guards';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('profile')
  @UseGuards(JwtCommonAuthGuard)
  async getMyProfile(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<UserProfileOutput>> {
    return this.userService.getMyProfile(ctx.user.id);
  }

  @Patch('change-password')
  @UseGuards(JwtCommonAuthGuard)
  public async changePassword(
    @ReqContext() ctx: RequestContext,
    @Body() input: ChangePasswordDto,
  ): Promise<BaseApiResponse<null>> {
    return this.userService.changePassword(
      ctx.user.id,
      input.oldPassword,
      input.newPassword,
    );
  }

  @Patch('deactivation')
  @UseGuards(JwtAdminAuthGuard)
  public async deActivatingUser(
    @ReqContext() ctx: RequestContext,
    @Body() input: UpdateUserStatusInput,
  ): Promise<BaseApiResponse<null>> {
    return this.userService.updateUserStatus(
      ctx.user.id,
      input
    );
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  public async updateProfile(
    @ReqContext() ctx: RequestContext,
    @Body() body: UpdateUserInput,
  ): Promise<BaseApiResponse<UserProfileOutput>> {
    return await this.userService.updateProfile(body, ctx.user.id);
  }

  @Post(':userId/follow')
  @UseGuards(JwtAuthGuard)
  public async followUser(
    @ReqContext() ctx: RequestContext,
    @Param('userId') userId: string,
  ): Promise<BaseApiResponse<null>> {
    return await this.userService.followUser(ctx.user.id, userId);
  }

  @Delete(':userId/unfollow')
  @UseGuards(JwtAuthGuard)
  public async unfollowUser(
    @ReqContext() ctx: RequestContext,
    @Param('userId') userId: string,
  ): Promise<BaseApiResponse<null>> {
    return await this.userService.unfollowUser(ctx.user.id, userId);
  }

  @Get('/friends')
  @UseGuards(JwtAuthGuard)
  public async getFriends(
    @Query() query: FriendFilter,
    @ReqContext() ctx: RequestContext,
  ): Promise<BasePaginationResponse<UserOutputDto>> {
    return this.userService.getFriends(query, ctx.user.id);
  }

  @Get('/followers')
  @UseGuards(JwtAuthGuard)
  public async getFollowers(
    @Query() query: FriendFilter,
    @ReqContext() ctx: RequestContext,
  ): Promise<BasePaginationResponse<UserOutputDto>> {
    return this.userService.getFollowers(query, ctx.user.id);
  }

  @Get('/followings')
  @UseGuards(JwtAuthGuard)
  public async getFollowings(
    @Query() query: FriendFilter,
    @ReqContext() ctx: RequestContext,
  ): Promise<BasePaginationResponse<UserOutputDto>> {
    return this.userService.getFollowings(query, ctx.user.id);
  }

  @Get('/filter')
  @UseGuards(JwtCommonAuthGuard)
  public async getUsers(
    @Query() query: UserFilter,
  ): Promise<BasePaginationResponse<UserOutputDto>> {
    return this.userService.getUsers(query);
  }

  // @Get('/search')
  // @UseGuards(JwtAuthGuard)
  // public async getUsersSearch(
  //   @Query() query: UserFilter,
  // ): Promise<BasePaginationResponse<UserSearchOutputDto>> {
  //   return this.userService.getUsersSearch(query);
  // }

  @Get('/top')
  @UseGuards(JwtAuthGuard)
  public async getTopUsers(
    @Query() query: TopUserFilter,
  ): Promise<TopUserPaginationResponse<TopUserOutput>> {
    return this.userService.getTopUsers(query);
  }

  @Get('user-profile/:id')
  @UseGuards(JwtCommonAuthGuard)
  public async getUserById(
    @Param('id') userId: string,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    return await this.userService.getUserById(userId);
  }
}
