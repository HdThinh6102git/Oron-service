import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AuthRegisterOutput,
  AuthTokenOutput,
  RegisterInput,
  VerificationUser,
} from '../dtos';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/providers';
import bcrypt from 'bcrypt';
import { UserOutputDto, UserProfileOutput } from '../../user/dtos';
import { plainToClass, plainToInstance } from 'class-transformer';
import { convertMilliseconds, generateCode } from '../../user/utils/user.utils';
import {
  IS_VERIFIED,
  MESSAGES,
  VERIFICATION_TIME,
} from '../../shared/constants';
import { User } from '#entity/user/user.entity';
import { JwtPayload, Payload, RefreshTokenPayload } from '../auth.interface';
import { MailService } from '../../shared/providers';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseApiResponse } from '../../shared/dtos';
import { isValidEmail, makeId } from '../../shared/utils/utils';
import { Verification } from '#entity/user/verification.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private mailService: MailService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Verification)
    private verificationRepository: Repository<Verification>,
  ) {}
  //common function
  public generateToken(user: UserOutputDto): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken({
        id: user.id,
        username: user.username,
        role: user.role,
      }),
      refreshToken: this.generateRefreshToken({
        sub: user.id,
      }),
    };
  }
  public generateAccessToken(data: Payload): string {
    const payload: JwtPayload = {
      id: data.id,
      username: data.username,
      role: data.role,
    };
    return this.jwt.sign(payload);
  }
  public generateRefreshToken(data: RefreshTokenPayload): string {
    return this.jwt.sign(data);
  }

  // register functions

  public async register(
    data: RegisterInput,
  ): Promise<BaseApiResponse<AuthRegisterOutput>> {
    //check valid email
    if (!isValidEmail(data.email)) {
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.WRONG_EMAIL_FORMAT,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //check valid phone number

    // if (!isValidPhone(data.phoneNumber)) {
    //   throw new HttpException(
    //     {
    //       error: true,
    //       data: null,
    //       message: MESSAGES.WRONG_PHONE_NUMBER_FORMAT,
    //       code: 1,
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    //create new user
    const createdUser = await this.userService.create(data);
    //convert to user output information
    const userOutput = plainToInstance(UserOutputDto, createdUser, {
      excludeExtraneousValues: true,
    });
    //generate token
    const jwt = this.generateToken(userOutput);
    //generate verification
    const emailVerifyCode = generateCode();
    const verificationTime: number =
      Date.now() + convertMilliseconds(VERIFICATION_TIME);
    //update token and verification for user
    await this.userService.update(createdUser.id, {
      refreshToken: jwt.refreshToken,
      emailVerifyCode: emailVerifyCode,
      verificationTime: verificationTime,
    });
    // send verification mail
    createdUser.emailVerifyCode = emailVerifyCode;
    await this.mailService.sendEmailVerification(createdUser);
    // convert to register output
    const output = plainToClass(
      AuthRegisterOutput,
      {
        token: jwt.accessToken,
        refreshToken: jwt.refreshToken,
        user: userOutput,
      },
      { excludeExtraneousValues: true },
    );
    //return result
    return {
      error: false,
      data: output,
      message: MESSAGES.CREATED_SUCCEED,
      code: 0,
    };
  }

  public async verificationRegisteringUser(
    input: VerificationUser,
  ): Promise<BaseApiResponse<UserProfileOutput>> {
    //find user by id
    const user = await this.userRepository.findOne({
      where: {
        id: input.id,
      },
    });
    if (!user) {
      throw new NotFoundException(MESSAGES.NOT_FOUND_USER);
    }
    //check verified user
    if (user.isVerifyEmail === IS_VERIFIED) {
      throw new NotFoundException(MESSAGES.USER_VERIFIED);
    }
    //check expired code
    if (user.verificationTime && Date.now() > user.verificationTime) {
      throw new NotFoundException(MESSAGES.VERIFICATION_EXPIRED);
    }
    //check valid code
    if (
      user.emailVerifyCode.toUpperCase() !==
      input.verificationCode.toUpperCase()
    ) {
      throw new NotFoundException(MESSAGES.VERIFICATION_INCORRECT);
    }
    //update user to be verified
    user.isVerifyEmail = true;
    await this.userRepository.update(
      { id: input.id },
      { isVerifyEmail: user.isVerifyEmail },
    );
    //send mail registered successfully
    this.mailService.sendMailSignUpSuccessfully(user);
    //return
    const output = plainToClass(UserProfileOutput, user, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: output,
      code: 0,
      message: MESSAGES.SEND_MAIL_SUCCESSFULLY,
    };
  }

  public async resendRegisterVerificationMail(
    userId: string,
  ): Promise<BaseApiResponse<null>> {
    //find user by id
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(MESSAGES.NOT_FOUND_USER);
    }
    //check to prevent spam
    if (Date.now() <= user.verificationTime) {
      throw new BadRequestException(MESSAGES.VERIFICATION_CODE_NOT_EXPIRED);
    }
    // generate verification
    user.emailVerifyCode = generateCode();
    user.verificationTime = Date.now() + convertMilliseconds(VERIFICATION_TIME);
    //update verification code and time
    await this.userRepository.update(
      { id: user.id },
      {
        emailVerifyCode: user.emailVerifyCode,
        verificationTime: user.verificationTime,
      },
    );
    //send verification mail
    const sendMail = await this.mailService.sendEmailVerification(user);
    if (sendMail.error)
      throw new HttpException(
        {
          message: sendMail.data,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    //return result
    return {
      error: false,
      data: null,
      code: 0,
      message: MESSAGES.SEND_MAIL_SUCCESSFULLY,
    };
  }

  //login function

  public async verifyLogin(
    username: string,
    password: string,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    //validate user
    const user = await this.userService.validateUser(username, password);
    //check verified mail user
    if (!user.isVerifyEmail)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.UNCONFIRMED_ACCOUNT,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    //generate token and update refresh token
    const jwt = this.generateToken(user);
    await this.userService.update(user.id, {
      refreshToken: jwt.refreshToken,
    });
    //convert to output
    const output = plainToClass(
      AuthTokenOutput,
      {
        id: user.id,
        token: jwt.accessToken,
        refreshToken: jwt.refreshToken,
      },
      { excludeExtraneousValues: true },
    );
    //return result
    return {
      error: false,
      data: output,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 0,
    };
  }

  //forgot password function
  public async verifyCodeForgotPassword(input: VerificationUser) {
    //find user by id
    const user = await this.userRepository.findOne({
      where: {
        id: input.id,
      },
    });
    if (!user) {
      throw new NotFoundException(MESSAGES.NOT_FOUND_USER);
    }
    //check expired verification time
    const latestVerification = await this.verificationRepository.findOne({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });
    if (
      latestVerification &&
      latestVerification.verificationTime &&
      Date.now() > latestVerification.verificationTime
    ) {
      throw new NotFoundException(MESSAGES.VERIFICATION_EXPIRED);
    }
    //compare verification code
    if (
      latestVerification &&
      latestVerification.verificationCode.toUpperCase() !==
        input.verificationCode.toUpperCase()
    ) {
      throw new NotFoundException(MESSAGES.VERIFICATION_INCORRECT);
    }
    //generate new password
    const password = makeId(10);
    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    await this.userRepository.update({ id: user.id }, { password: hash });
    //send mail after verified
    const sendingMail =
      await this.mailService.sendMailForgotPasswordAfterVerified(
        user,
        password,
      );
    if (sendingMail.error)
      throw new HttpException(
        {
          message: sendingMail.data,
          code: 1,
        },
        HttpStatus.BAD_REQUEST,
      );
    //return output
    return {
      error: false,
      data: null,
      message: MESSAGES.SEND_MAIL_SUCCESSFULLY,
      code: 0,
    };
  }
}
