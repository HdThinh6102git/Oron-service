import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '#entity/user/user.entity';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { Role } from '#entity/user/role.entity';
import { ConfigService } from '@nestjs/config';
import { RegisterInput } from '../../auth/dtos';
import * as bcrypt from 'bcrypt';
import { MESSAGES, TYPE_PIC } from '../../shared/constants';

import {
  FriendFilter,
  UpdateProfileInput,
  UpdateUserInput,
  UserOutputDto,
  UserProfileOutput,
} from '../dtos';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Province } from '#entity/user/address/province.entity';
import { District } from '#entity/user/address/district.entity';
import { Ward } from '#entity/user/address/ward.entity';
import { ROLE } from '../../auth/constants';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import {
  USER_CONNECTION_TYPE,
  UserConnection,
} from '#entity/user/user-connection.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private config: ConfigService,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
    @InjectRepository(UserConnection)
    private userConnectionRepo: Repository<UserConnection>,
  ) {}

  public async create(data: RegisterInput): Promise<User> {
    //check exist province
    const provinceExist = await this.provinceRepository.findOne({
      where: {
        id: data.province,
      },
    });
    if (!provinceExist) {
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.PROVINCE_NOT_EXISTS,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //check exist district
    const districtExist = await this.districtRepository.findOne({
      where: {
        id: data.district,
      },
    });
    if (!districtExist) {
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.DISTRICT_NOT_EXISTS,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //check exist ward
    const wardExist = await this.wardRepository.findOne({
      where: {
        id: data.ward,
      },
    });
    if (!wardExist) {
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.WARD_NOT_EXISTS,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //check phone exist
    const userWithPhoneExist = await this.userRepository.findOne({
      where: {
        phoneNumber: data.phoneNumber,
      },
    });
    if (userWithPhoneExist)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.PHONE_NUMBER_EXISTS,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    //check email exist
    const userWithEmailExist = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });
    if (userWithEmailExist)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.EMAIL_EXISTS,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    //check user name exist
    const userWithUsernameExist = await this.userRepository.findOne({
      where: {
        username: data.username,
      },
    });
    if (userWithUsernameExist)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.USER_NAME_EXISTS,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    //set full address
    const fullAddress = `${wardExist.level} ${wardExist.name}, ${districtExist.level} ${districtExist.name}, ${provinceExist.level} ${provinceExist.name}`;
    //hash password
    const hash = bcrypt.hashSync(
      data.password,
      this.config.get('saltRounds') || 7,
    );
    // set role user
    const userRole = await this.roleRepository.findOneBy({
      name: ROLE.USER,
    });
    if (!userRole)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.ROLE_NOT_FOUND,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    //save user data
    return this.userRepository.save({
      ...data,
      province: provinceExist,
      district: districtExist,
      ward: wardExist,
      password: hash,
      role: userRole,
      fullAddress: fullAddress,
    });
  }

  public async update(
    id: string,
    data: UpdateProfileInput,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user)
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.NOT_FOUND_USER,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );

    const newData = {
      ...user,
      ...data,
    };

    const updated = await this.userRepository.save(newData);

    const result = plainToInstance(UserOutputDto, updated, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async findUserByEmailOrPhone(username: string): Promise<User> {
    const user: any = await this.userRepository.findOne({
      where: [{ phoneNumber: username }, { email: ILike(username) }],
    });
    return user;
  }

  public async validateUser(
    username: string,
    password: string,
  ): Promise<UserOutputDto> {
    // find user by email or phone
    const user = await this.findUserByEmailOrPhone(username);
    if (!user)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND_USER,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    //compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.INCORRECT_PASSWORD,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    // return user output
    return plainToInstance(UserOutputDto, user, {
      excludeExtraneousValues: true,
    });
  }

  public async getMyProfile(
    userId: string,
  ): Promise<BaseApiResponse<UserProfileOutput>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        role: true,
      },
    });
    if (!user) throw new UnauthorizedException();
    const output = plainToClass(UserProfileOutput, user, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: output,
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }

  public async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<BaseApiResponse<null>> {
    //find user by id
    const existUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!existUser)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND_USER,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    //compare password
    const match = await bcrypt.compare(oldPassword, existUser.password);
    if (!match)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.INCORRECT_PASSWORD,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    //hash new password
    const hash = bcrypt.hashSync(
      newPassword,
      this.config.get('saltRounds') || 7,
    );
    //update password
    await this.userRepository.update({ id: userId }, { password: hash });
    //return
    return {
      error: false,
      data: null,
      code: 0,
      message: MESSAGES.UPDATE_SUCCEED,
    };
  }

  public async updateProfile(
    input: UpdateUserInput,
    userId: string,
  ): Promise<BaseApiResponse<UserProfileOutput>> {
    const userExist = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['role'],
    });
    if (!userExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.NOT_FOUND_USER,
        code: 4,
      });
    }
    if (input.status) {
      userExist.status = input.status;
    }
    if (input.name) {
      userExist.name = input.name;
    }
    if (input.phoneNumber) {
      const userWithPhoneExist = await this.userRepository.findOne({
        where: {
          phoneNumber: input.phoneNumber,
        },
      });
      if (userWithPhoneExist)
        throw new HttpException(
          {
            error: true,
            data: null,
            message: MESSAGES.PHONE_NUMBER_EXISTS,
            code: 1,
          },
          HttpStatus.BAD_REQUEST,
        );
      userExist.phoneNumber = input.phoneNumber;
    }
    if (input.specificAddress) {
      userExist.specificAddress = input.specificAddress;
    }
    if (input.province && input.district && input.ward) {
      const province = await this.provinceRepository.findOne({
        where: { id: input.province },
      });
      const district = await this.districtRepository.findOne({
        where: { id: input.district },
      });
      const ward = await this.wardRepository.findOne({
        where: { id: input.ward },
      });
      if (province && district && ward) {
        userExist.province = province;
        userExist.district = district;
        userExist.ward = ward;
        //set full address
        userExist.fullAddress = `${ward.level} ${ward.name}, ${district.level} ${district.name}, ${province.level} ${province.name}`;
      }
    }
    const updatedUser = await this.userRepository.save(userExist);
    const userOutput = plainToClass(UserProfileOutput, updatedUser, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: userOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async updateProfileImgUrl(
    status: number,
    imgUrl: string,
    userId: string,
  ): Promise<BaseApiResponse<UserProfileOutput>> {
    const userExist = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['role'],
    });
    if (!userExist) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.NOT_FOUND_USER,
        code: 4,
      });
    }
    if (status == TYPE_PIC.BACKGROUND) {
      userExist.backgroundPic = imgUrl;
    } else if (status == TYPE_PIC.PROFILE) {
      userExist.profilePic = imgUrl;
    }
    const updatedUser = await this.userRepository.save(userExist);
    const userOutput = plainToClass(UserProfileOutput, updatedUser, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: userOutput,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async followUser(
    followerUserId: string,
    followedUserId: string,
  ): Promise<BaseApiResponse<null>> {
    if (followerUserId === followedUserId) {
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.CAN_NOT_FOLLOW_YOUR_SELF,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const follower = await this.userRepository.findOne({
      where: {
        id: followerUserId,
      },
    });
    if (!follower)
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.FOLLOWER_NOT_FOUND,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    const followedUser = await this.userRepository.findOne({
      where: {
        id: followedUserId,
      },
    });
    if (!followedUser)
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.FOLLOWED_USER_NOT_FOUND,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    const myFollowerConnection = await this.userConnectionRepo.findOne({
      where: {
        follower: { id: followedUser.id },
        followed: { id: follower.id },
      },
    });
    if (myFollowerConnection) {
      myFollowerConnection.type = USER_CONNECTION_TYPE.BE_FRIEND;
      await this.userConnectionRepo.save(myFollowerConnection);
    } else {
      await this.userConnectionRepo.save({
        type: USER_CONNECTION_TYPE.FOLLOW,
        follower: follower,
        followed: followedUser,
      });
    }
    return {
      error: false,
      data: null,
      message: MESSAGES.CREATED_OR_UPDATED_SUCCEED,
      code: 0,
    };
  }

  public async unfollowUser(
    followerUserId: string,
    followedUserId: string,
  ): Promise<BaseApiResponse<null>> {
    const follower = await this.userRepository.findOne({
      where: {
        id: followerUserId,
      },
    });
    if (!follower)
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.FOLLOWER_NOT_FOUND,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    const followedUser = await this.userRepository.findOne({
      where: {
        id: followedUserId,
      },
    });
    if (!followedUser)
      throw new HttpException(
        {
          error: true,
          message: MESSAGES.FOLLOWED_USER_NOT_FOUND,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    const userConnectionFriend = await this.userConnectionRepo.findOne({
      where: [
        {
          followed: { id: followedUser.id },
          follower: { id: follower.id },
          type: USER_CONNECTION_TYPE.BE_FRIEND,
        },
        {
          follower: { id: followedUser.id },
          followed: { id: follower.id },
          type: USER_CONNECTION_TYPE.BE_FRIEND,
        },
      ],
      relations: ['follower', 'followed'],
    });
    if (userConnectionFriend) {
      if (userConnectionFriend.follower.id == follower.id) {
        const followedTemp = userConnectionFriend.followed;
        userConnectionFriend.followed = userConnectionFriend.follower;
        userConnectionFriend.follower = followedTemp;
        userConnectionFriend.type = USER_CONNECTION_TYPE.FOLLOW;
        await this.userConnectionRepo.save(userConnectionFriend);
      } else if (userConnectionFriend.followed.id == follower.id) {
        userConnectionFriend.type = USER_CONNECTION_TYPE.FOLLOW;
        await this.userConnectionRepo.save(userConnectionFriend);
      }
    } else {
      const userConnectionFollow = await this.userConnectionRepo.findOne({
        where: {
          followed: { id: followedUser.id },
          follower: { id: follower.id },
          type: USER_CONNECTION_TYPE.FOLLOW,
        },
      });
      if (userConnectionFollow) {
        await this.userConnectionRepo.delete(userConnectionFollow.id);
      } else {
        throw new HttpException(
          {
            error: true,
            message: MESSAGES.FOLLOWED_USER_NOT_FOUND,
            code: 4,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return {
      error: false,
      data: null,
      message: MESSAGES.UPDATED_OR_DELETED_SUCCEED,
      code: 0,
    };
  }

  public async getFriends(
    filter: FriendFilter,
    userId: string,
  ): Promise<BasePaginationResponse<UserOutputDto>> {
    const where: any = {
      id: Not(IsNull()),
      deletedAt: IsNull(),
    };
    if (filter.name) {
      where['name'] = ILike(`%${filter.name}%`);
    }
    if (filter.fullAddress) {
      where['fullAddress'] = ILike(`%${filter.fullAddress}%`);
    }
    if (filter.specificAddress) {
      where['specificAddress'] = ILike(`%${filter.specificAddress}%`);
    }
    const firstFriendIdsArray = await this.userConnectionRepo
      .createQueryBuilder('userConnection')
      .select('userConnection.followed_id')
      .where('userConnection.follower_id = :userId', { userId })
      .andWhere('userConnection.type = 1')
      .getRawMany();
    const firstFriendIdValuesArray = firstFriendIdsArray.map(
      (item) => item.followed_id,
    );
    const secondFriendIdsArray = await this.userConnectionRepo
      .createQueryBuilder('userConnection')
      .select('userConnection.follower_id')
      .where('userConnection.followed_id = :userId', { userId })
      .andWhere('userConnection.type = 1')
      .getRawMany();
    const secondFriendIdValuesArray = secondFriendIdsArray.map(
      (item) => item.follower_id,
    );
    const allFriendIdsArray = [
      ...firstFriendIdValuesArray,
      ...secondFriendIdValuesArray,
    ];
    const friends = await this.userRepository.find({
      where: {
        ...where,
        id: In(allFriendIdsArray),
      },
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
    });
    const friendsOutput = plainToInstance(UserOutputDto, friends, {
      excludeExtraneousValues: true,
    });
    const count = await this.userRepository.count({
      where: {
        ...where,
        id: In(allFriendIdsArray),
      },
    });
    return {
      listData: friendsOutput,
      total: count,
    };
  }
  public async getFollowers(
    filter: FriendFilter,
    userId: string,
  ): Promise<BasePaginationResponse<UserOutputDto>> {
    const where: any = {
      id: Not(IsNull()),
      deletedAt: IsNull(),
    };
    if (filter.name) {
      where['name'] = ILike(`%${filter.name}%`);
    }
    if (filter.fullAddress) {
      where['fullAddress'] = ILike(`%${filter.fullAddress}%`);
    }
    if (filter.specificAddress) {
      where['specificAddress'] = ILike(`%${filter.specificAddress}%`);
    }
    const firstFriendIdsArray = await this.userConnectionRepo
      .createQueryBuilder('userConnection')
      .select('userConnection.followed_id')
      .where('userConnection.follower_id = :userId', { userId })
      .andWhere('userConnection.type = 1')
      .getRawMany();
    const firstFriendIdValuesArray = firstFriendIdsArray.map(
      (item) => item.followed_id,
    );
    const secondFriendIdsArray = await this.userConnectionRepo
      .createQueryBuilder('userConnection')
      .select('userConnection.follower_id')
      .where('userConnection.followed_id = :userId', { userId })
      .andWhere('userConnection.type = 1')
      .getRawMany();
    const secondFriendIdValuesArray = secondFriendIdsArray.map(
      (item) => item.follower_id,
    );
    const allFriendIdsArray = [
      ...firstFriendIdValuesArray,
      ...secondFriendIdValuesArray,
    ];

    const followerNotFriendIdsArray = await this.userConnectionRepo
      .createQueryBuilder('userConnection')
      .select('userConnection.follower_id')
      .where('userConnection.followed_id = :userId', { userId })
      .andWhere('userConnection.type = 0')
      .getRawMany();
    const followerNotFriendIdValuesArray = followerNotFriendIdsArray.map(
      (item) => item.follower_id,
    );
    const allFollowerIdsArray = [
      ...allFriendIdsArray,
      ...followerNotFriendIdValuesArray,
    ];

    const followers = await this.userRepository.find({
      where: {
        ...where,
        id: In(allFollowerIdsArray),
      },
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
    });
    const followersOutput = plainToInstance(UserOutputDto, followers, {
      excludeExtraneousValues: true,
    });
    const count = await this.userRepository.count({
      where: {
        ...where,
        id: In(allFollowerIdsArray),
      },
    });
    return {
      listData: followersOutput,
      total: count,
    };
  }

  public async getFollowings(
    filter: FriendFilter,
    userId: string,
  ): Promise<BasePaginationResponse<UserOutputDto>> {
    const where: any = {
      id: Not(IsNull()),
      deletedAt: IsNull(),
    };
    if (filter.name) {
      where['name'] = ILike(`%${filter.name}%`);
    }
    if (filter.fullAddress) {
      where['fullAddress'] = ILike(`%${filter.fullAddress}%`);
    }
    if (filter.specificAddress) {
      where['specificAddress'] = ILike(`%${filter.specificAddress}%`);
    }
    const firstFriendIdsArray = await this.userConnectionRepo
      .createQueryBuilder('userConnection')
      .select('userConnection.followed_id')
      .where('userConnection.follower_id = :userId', { userId })
      .andWhere('userConnection.type = 1')
      .getRawMany();
    const firstFriendIdValuesArray = firstFriendIdsArray.map(
      (item) => item.followed_id,
    );
    const secondFriendIdsArray = await this.userConnectionRepo
      .createQueryBuilder('userConnection')
      .select('userConnection.follower_id')
      .where('userConnection.followed_id = :userId', { userId })
      .andWhere('userConnection.type = 1')
      .getRawMany();
    const secondFriendIdValuesArray = secondFriendIdsArray.map(
      (item) => item.follower_id,
    );
    const allFriendIdsArray = [
      ...firstFriendIdValuesArray,
      ...secondFriendIdValuesArray,
    ];
    const followingNotFriendIdsArray = await this.userConnectionRepo
      .createQueryBuilder('userConnection')
      .select('userConnection.followed_id')
      .where('userConnection.follower_id = :userId', { userId })
      .andWhere('userConnection.type = 0')
      .getRawMany();
    const followingNotFriendIdValuesArray = followingNotFriendIdsArray.map(
      (item) => item.followed_id,
    );
    const allFollowingIdsArray = [
      ...allFriendIdsArray,
      ...followingNotFriendIdValuesArray,
    ];
    const followings = await this.userRepository.find({
      where: {
        ...where,
        id: In(allFollowingIdsArray),
      },
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
    });
    const followingsOutput = plainToInstance(UserOutputDto, followings, {
      excludeExtraneousValues: true,
    });
    const count = await this.userRepository.count({
      where: {
        ...where,
        id: In(allFollowingIdsArray),
      },
    });
    return {
      listData: followingsOutput,
      total: count,
    };
  }
}
