import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    const result = await this.usersRepository.create(createUserDto);
    return result;
  }

  public async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  public async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
      relations: {
        role: true,
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
      },
    });
  }

  public async getCredsByEmail(
    email: string,
  ): Promise<Pick<User, 'password' | 'id' | 'role'> | null> {
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
      },
    });
  }

  public async findFullByEmail(email: string) {}

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
