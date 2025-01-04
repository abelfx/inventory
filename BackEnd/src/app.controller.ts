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

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jwtService: JwtService,
  ) {}

  // Registration Controller
  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    // Check if user already exists
    const existingUser = await this.appService.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await this.appService.create({
      name,
      email,
      password: hashedPassword,
    });

    // Exclude password from the response
    const { password: _, ...result } = user.toObject();
    return result;
  }

  // Login Controller
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    // Find user by email
    const user = await this.appService.findOne({ email });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Generate token
    const jwt = await this.jwtService.signAsync({ id: user._id });

    // Set cookie
    response.cookie('jwt', jwt, { httpOnly: true });

    return { status: 'Login successful!' };
  }

  // Get Authenticated User
  @Get('user')
  async users(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) throw new UnauthorizedException();

      // Find user by ID
      const user = await this.appService.findOne({ _id: data['id'] });

      if (!user) {
        throw new UnauthorizedException();
      }

      // Exclude password from the response
      const { password, ...response } = user.toObject();
      return response;
    } catch (error) {
      console.error(
        'An error occurred while getting authenticated users:',
        error,
      );
      throw new UnauthorizedException();
    }
  }

  // Logout Users
  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { status: 'Logout successful!' };
  }
}
