import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  Req,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { PassThrough } from 'stream';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jwtService: JwtService, // Use camelCase for dependency injection
  ) {}

  // Registration controller
  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.appService.create({
      name,
      email,
      password: hashedPassword,
    });

    delete user.password;
    return user;
  }

  // Login controller
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.appService.findOne({ email });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Generate token
    const jwt = await this.jwtService.signAsync({ id: user.id });

    // Set cookie
    response.cookie('jwt', jwt, { httpOnly: true });

    return response.status(200).send({
      status: 'Login successful!',
    });
  }

  // Get Authenticated Users
  @Get('user')
  async users(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) throw new UnauthorizedException();

      const user = await this.appService.findOne({ id: data['id'] });

      const { password, ...response } = user;
      return response;
    } catch (error) {
      console.log('An Error Occured while getting Authorized Users: ', error);
      throw new UnauthorizedException();
    }
  }

  // logout users
  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      status: 'logout successful!',
    };
  }
}
