import { UpdateUserDto } from './../users/dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class BaseUserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    const result = await this.usersRepository.create(createUserDto);
    return result;
  }

  public async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find({
      relations: {
        role: true,
        office: true,
        country: true,
      },
    });
    return users;
  }

  public async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
      relations: {
        role: true,
        office: true,
        country: true,
      },
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
      relations: {
        role: true,
        office: true,
        country: true,
      },
    });
  }

  public async getCredsByEmail(
    email: string,
  ): Promise<Pick<User, 'password' | 'id' | 'role' | 'isBlocked'> | null> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
      relations: {
        role: true,
      },
      select: {
        password: true,
        id: true,
        isBlocked: true,
        lastFailedLoginTime: true,
        lastFailedLoginCount: true,
        timeToWaitBeforeLoginMs: true,
      },
    });
  }

  public async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.usersRepository.update(id, updateUserDto);
  }

  public async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
