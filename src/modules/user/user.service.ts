import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { UserRegisterDto } from '../auth/dto/UserRegisterDto';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async createUser(
    userRegisterDto: UserRegisterDto,
  ): Promise<UserEntity> {
    return this.userRepository.save(userRegisterDto);
  }

  public async findOneByCondition(
    condition: ObjectLiteral,
  ): Promise<UserEntity> {
    return this.userRepository.findOne({ where: condition });
  }
}
