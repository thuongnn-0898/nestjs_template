import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { plainToClass, plainToInstance } from 'class-transformer';

import UserService from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';
import { UserRegisterDto } from './dto/RegisterDto';
import { LocalAuthGuard } from '../../guards/local.auth.guard';
import { AuthenticatedGuard } from '../../guards/authenticated.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UserDto,
    description: 'User info with access token',
  })
  async userLogin(@Req() req: Request): Promise<UserDto> {
    const userEntity = req.user;

    return plainToInstance(UserDto, userEntity);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UserDto,
  })
  async me(@Req() req: Request) {
    return plainToClass(UserDto, req.user);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<UserDto> {
    const createdUser = await this.userService.createUser(userRegisterDto);

    return plainToInstance(UserDto, createdUser);
  }
}
