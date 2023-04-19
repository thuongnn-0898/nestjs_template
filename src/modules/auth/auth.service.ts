import { Injectable } from '@nestjs/common';

import { validateHash } from '../../common/utils';
import { UserNotFoundException } from '../../exceptions';
import type { UserEntity } from '../user/user.entity';
import UserService from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findOneByCondition({
      email: email,
    });

    const isPasswordValid = await validateHash(password, user?.password);

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return user!;
  }
}
