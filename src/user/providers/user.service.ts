import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, USER_STATUS } from '#entity/user/user.entity';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { Role } from '#entity/user/role.entity';
import { ConfigService } from '@nestjs/config';
import { RegisterInput } from '@modules/auth/dtos';
import * as bcrypt from 'bcrypt';
import { MESSAGES, TYPE_PIC } from '@modules/shared/constants';

import {
  AdminOutput,
  CreateAdminInput,
  FriendFilter,
  TopUserFilter,
  TopUserOutput,
  UpdateProfileInput,
  UpdateUserInput,
  UpdateUserStatusInput,
  UserFilter,
  UserOutputDto,
  UserProfileOutput,
} from '@modules/user/dtos';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Province } from '#entity/user/address/province.entity';
import { District } from '#entity/user/address/district.entity';
import { Ward } from '#entity/user/address/ward.entity';
import { ROLE } from '@modules/auth/constants';
import {
  BaseApiResponse,
  BasePaginationResponse,
  TopUserPaginationResponse,
} from '@modules/shared/dtos';
import {
  USER_CONNECTION_TYPE,
  UserConnection,
} from '#entity/user/user-connection.entity';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { Post } from '#entity/post/post.entity';
import { Review } from '#entity/review.entity';
import { RELATED_TYPE } from '#entity/file';
import { FileService } from '@modules/shared/providers';
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
    private fileService: FileService,
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
    // const userWithPhoneExist = await this.userRepository.findOne({
    //   where: {
    //     phoneNumber: data.phoneNumber,
    //     sysFlag: '1'
    //   },
    // });
    // if (userWithPhoneExist)
    //   throw new HttpException(
    //     {
    //       error: true,
    //       data: null,
    //       message: MESSAGES.PHONE_NUMBER_EXISTS,
    //       code: 1,
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    //check email exist
    const userWithEmailExist = await this.userRepository.findOne({
      where: {
        email: data.email,
        sysFlag: '1'
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
        sysFlag: '1'
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
      sysFlag: '1'
    });
  }

  public async update(
    id: string,
    data: UpdateProfileInput,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
        sysFlag: '1'
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

  public async updateUserStatus(
    modifyBy: string,
    data: UpdateUserStatusInput
  ): Promise<BaseApiResponse<null>> {
    const user = await this.userRepository.findOne({
      where: {
        id: data.userId,
        sysFlag: '1'
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
      modifyBy: modifyBy,
    };

    await this.userRepository.save(newData);

    return {
      error: false,
      data: null,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  public async findUserByEmailOrPhone(username: string): Promise<User> {
    const user: any = await this.userRepository.findOne({
      where: { 
        email: ILike(username),
        sysFlag: '1' 
      },
      relations: ['role'],
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
      where: { 
        id: userId,
        sysFlag: '1' 
      },
      relations: {
        role: true,
      },
    });
    if (!user) throw new UnauthorizedException();

    
    const output = plainToClass(UserProfileOutput, user, {
      excludeExtraneousValues: true,
    });
    //get user profile pic 
    const imageProfileObject = await this.fileService.getRelatedFile(output.id, RELATED_TYPE.USER_PROFILE);
    if(imageProfileObject){
      output.profilePic = imageProfileObject;
    }
    //get user background pic 
    const imageBackgroundObject = await this.fileService.getRelatedFile(output.id, RELATED_TYPE.USER_BACKGROUND);
    if(imageBackgroundObject){
      output.backgroundPic = imageBackgroundObject;
    }
    
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
      where: { 
        id: userId,
        sysFlag: '1'
       },
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
        sysFlag: '1'
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
          id: Not(userId),
          sysFlag: '1'
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
    if(input.birthDate){
      userExist.birthDate = input.birthDate;
    }
    if(input.genderCD){
      userExist.genderCD = input.genderCD;
    }
    if(input.relatedUrl){
      userExist.relatedUrl = input.relatedUrl;
    }
    const updatedUser = await this.userRepository.save(userExist);
    const userOutput = plainToClass(UserProfileOutput, updatedUser, {
      excludeExtraneousValues: true,
    });
    //get user profile pic 
    const imageProfileObject = await this.fileService.getRelatedFile(userOutput.id, RELATED_TYPE.USER_PROFILE);
    if(imageProfileObject){
      userOutput.profilePic = imageProfileObject;
    }
    //get user background pic 
    const imageBackgroundObject = await this.fileService.getRelatedFile(userOutput.id, RELATED_TYPE.USER_BACKGROUND);
    if(imageBackgroundObject){
      userOutput.backgroundPic = imageBackgroundObject;
    }
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
        sysFlag: '1'
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
        sysFlag: '1'
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
        sysFlag: '1'
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
      sysFlag: '1',
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
    for (let i = 0; i < friendsOutput.length; i++) {
      //get user profile pic 
      const imageProfileObject = await this.fileService.getRelatedFile(friendsOutput[i].id, RELATED_TYPE.USER_PROFILE);
      if(imageProfileObject){
        friendsOutput[i].profilePic = imageProfileObject;
      }
      //get user background pic 
      const imageBackgroundObject = await this.fileService.getRelatedFile(friendsOutput[i].id, RELATED_TYPE.USER_BACKGROUND);
      if(imageBackgroundObject){
        friendsOutput[i].backgroundPic = imageBackgroundObject;
      }
    }
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
      sysFlag: '1',
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
    for (let i = 0; i < followersOutput.length; i++) {
      //get user profile pic 
      const imageProfileObject = await this.fileService.getRelatedFile(followersOutput[i].id, RELATED_TYPE.USER_PROFILE);
      if(imageProfileObject){
        followersOutput[i].profilePic = imageProfileObject;
      }
      //get user background pic 
      const imageBackgroundObject = await this.fileService.getRelatedFile(followersOutput[i].id, RELATED_TYPE.USER_BACKGROUND);
      if(imageBackgroundObject){
        followersOutput[i].backgroundPic = imageBackgroundObject;
      }
    }
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
      sysFlag: '1',
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
    for (let i = 0; i < followingsOutput.length; i++) {
      //get user profile pic 
      const imageProfileObject = await this.fileService.getRelatedFile(followingsOutput[i].id, RELATED_TYPE.USER_PROFILE);
      if(imageProfileObject){
        followingsOutput[i].profilePic = imageProfileObject;
      }
      //get user background pic 
      const imageBackgroundObject = await this.fileService.getRelatedFile(followingsOutput[i].id, RELATED_TYPE.USER_BACKGROUND);
      if(imageBackgroundObject){
        followingsOutput[i].backgroundPic = imageBackgroundObject;
      }
    }
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

  public async getUsers(
    filter: UserFilter,
  ): Promise<BasePaginationResponse<UserOutputDto>> {
    let wheres: any[] = [];
    const where: any = {
      id: Not(IsNull()),
      sysFlag: '1',
      status: USER_STATUS.ACTIVE,
      role: { name: ROLE.USER },
    };
    if (filter.keyword) {
      wheres = [
        {
          ...where,
          username: ILike(`${filter.keyword}%`),
        },
      ];
    }
    if (isEmpty(wheres)) {
      wheres.push(where);
    }
    const users = await this.userRepository.find({
      where: wheres,
      take: filter.limit,
      skip: filter.skip,
      order: {
        createdAt: 'DESC',
      },
    });
    
    const count = await this.userRepository.count({
      where: wheres,
    });
    const usersOutput = plainToInstance(UserOutputDto, users, {
      excludeExtraneousValues: true,
    });
    for (let i = 0; i < usersOutput.length; i++) {
      //get user profile pic 
      const imageProfileObject = await this.fileService.getRelatedFile(usersOutput[i].id, RELATED_TYPE.USER_PROFILE);
      if(imageProfileObject){
        usersOutput[i].profilePic = imageProfileObject;
      }
      //get user background pic 
      const imageBackgroundObject = await this.fileService.getRelatedFile(usersOutput[i].id, RELATED_TYPE.USER_BACKGROUND);
      if(imageBackgroundObject){
        usersOutput[i].backgroundPic = imageBackgroundObject;
      }
    }
    return {
      listData: usersOutput,
      total: count,
    };
  }

  public async getTopUsers(
    filter: TopUserFilter,
  ): Promise<TopUserPaginationResponse<TopUserOutput>> {
    const firstDateOfWeek = filter.weekNumber * 7 - 6;
    const lastDateOfWeek = filter.weekNumber * 7;
    const queryBuilder = await this.userRepository
      .createQueryBuilder('u')
      .select('u.id', 'id')
      .addSelect('u.username', 'username')
      .addSelect('u.profile_pic', 'profilePic')
      .addSelect('ROUND(AVG(r.number_star), 1)', 'avg_star')
      .addSelect('COUNT(p.id)', 'post_count')
      .innerJoin(Post, 'p', 'u.id = p.user_id')
      .innerJoin(Review, 'r', 'p.id = r.post_id')
      .where(
        `p.created_at >=  (SELECT DATE_TRUNC('year', CURRENT_DATE)::DATE + INTERVAL '${firstDateOfWeek} days')  AND p.created_at <=(SELECT (DATE_TRUNC('year', CURRENT_DATE))::DATE + INTERVAL '${lastDateOfWeek} days')`,
      )
      .groupBy('u.id')
      .addGroupBy('u.username')
      .addGroupBy('u.profile_pic')
      .orderBy('avg_star', 'DESC')
      .addOrderBy('post_count', 'DESC')
      .limit(filter.limit);
    const topUsers = await queryBuilder.getRawMany();
    const topUsersOutput = plainToInstance(TopUserOutput, topUsers, {
      excludeExtraneousValues: true,
    });
    for (let i = 0; i < topUsersOutput.length; i++) {
      //get user profile pic 
      const imageProfileObject = await this.fileService.getRelatedFile(topUsersOutput[i].id, RELATED_TYPE.USER_PROFILE);
      if(imageProfileObject){
        topUsersOutput[i].profilePic = imageProfileObject;
      }
      
    }
    return {
      listData: topUsersOutput,
    };
  }

  public async createNewAdmin(
    input: CreateAdminInput,
  ): Promise<BaseApiResponse<AdminOutput>> {
    const adminWithUsernameExist = await this.userRepository.findOne({
      where: {
        username: input.username,
        role: { name: ROLE.ADMIN },
        sysFlag: '1'
      },
    });
    if (adminWithUsernameExist)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.USER_NAME_EXISTS,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    const hash = bcrypt.hashSync(
      input.password,
      this.config.get('saltRounds') || 7,
    );
    const adminRole = await this.roleRepository.findOneBy({
      name: ROLE.ADMIN,
    });
    if (!adminRole)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.ROLE_NOT_FOUND,
          code: 4,
        },
        HttpStatus.BAD_REQUEST,
      );
    const admin = await this.userRepository.save({
      ...input,
      password: hash,
      role: adminRole,
      isVerifyEmail: true,
    });
    const adminOutput = plainToClass(AdminOutput, admin, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: adminOutput,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async getUserById(
    userId: string,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    const user = await this.userRepository.findOne({
      where: { 
        id: userId, 
        sysFlag: '1'
      },
    });
    if (!user) {
      throw new NotFoundException({
        error: true,
        message: MESSAGES.NOT_FOUND_USER,
        code: 4,
      });
    }
    const userOutput = plainToClass(UserOutputDto, user, {
      excludeExtraneousValues: true,
    });
    //get user profile pic 
    const imageProfileObject = await this.fileService.getRelatedFile(userOutput.id, RELATED_TYPE.USER_PROFILE);
    if(imageProfileObject){
      userOutput.profilePic = imageProfileObject;
    }
    //get user background pic 
    const imageBackgroundObject = await this.fileService.getRelatedFile(userOutput.id, RELATED_TYPE.USER_BACKGROUND);
    if(imageBackgroundObject){
      userOutput.backgroundPic = imageBackgroundObject;
    }
    return {
      error: false,
      data: userOutput,
      message: MESSAGES.GET_SUCCEED,
      code: 0,
    };
  }
}
