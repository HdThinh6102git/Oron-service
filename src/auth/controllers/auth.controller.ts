import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from '../providers';
import {
  AuthRegisterOutput,
  AuthTokenOutput,
  LoginInput,
  RegisterInput,
  ResendMailDto,
  VerificationUser,
} from '../dtos';
import { BaseApiResponse } from '../../shared/dtos';
import { UserProfileOutput } from '../../user/dtos';
import { MailService } from '../../shared/providers';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
  ) {}
  //register

  @Post('register')
  public async register(
    @Body() body: RegisterInput,
  ): Promise<BaseApiResponse<AuthRegisterOutput>> {
    return this.authService.register(body);
  }

  @Post('verification-register')
  public async verificationRegisteringUser(
    @Body() input: VerificationUser,
  ): Promise<BaseApiResponse<UserProfileOutput>> {
    return this.authService.verificationRegisteringUser(input);
  }

  @Post('resend-register-verification-mail')
  public async resendRegisterVerificationMail(
    @Body() input: ResendMailDto,
  ): Promise<BaseApiResponse<null>> {
    return this.authService.resendRegisterVerificationMail(input.userId);
  }

  //login

  @Post('login')
  public async login(
    @Body() body: LoginInput,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    return this.authService.verifyLogin(body.username, body.password);
  }

  //forgot password

  @Post('sending-forgot-password-mail')
  public async sendForgotPasswordVerificationMail(
    @Body() body: { email: string },
  ) {
    return this.mailService.sendForgotPasswordVerificationMail(body.email);
  }

  @Post('verification-forgot-password-code')
  public async verifyCodeForgotPassword(@Body() input: VerificationUser) {
    return this.authService.verifyCodeForgotPassword(input);
  }
}
