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
    console.log('usersRepository', this.usersRepository);
    const result = await this.usersRepository.create(createUserDto);
  }

  public async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    console.log('users', users);
    return users;
  }

  public async findOne(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
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
