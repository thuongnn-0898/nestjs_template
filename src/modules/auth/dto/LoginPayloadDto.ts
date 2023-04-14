import { ApiProperty } from '@nestjs/swagger';

import { TokenPayloadDto } from './TokenPayloadDto';
import { UserDto } from '../../../modules/user/dto/user.dto';
import { Type } from 'class-transformer';

export class LoginPayloadDto {
  @ApiProperty({ type: UserDto })
  @Type(() => UserDto)
  user: UserDto;

  @ApiProperty({ type: TokenPayloadDto })
  token: TokenPayloadDto;
}
