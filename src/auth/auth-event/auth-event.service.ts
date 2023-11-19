import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateAuthEventDto } from '../dto/create-auth-event.dto';
import { UpdateAuthEventDto } from '../dto/update-auth-event.dto';
import { AuthEvent } from './entities/auth-event.entity';

@Injectable()
export class AuthEventService {
  constructor(
    @InjectRepository(AuthEvent)
    private authEventRepository: Repository<AuthEvent>,
  ) {}

  public async create(createAuthEventDto: CreateAuthEventDto) {
    const result = await this.authEventRepository.create({
      ...createAuthEventDto,
      user: {
        id: createAuthEventDto.userId,
      },
    });
    result.save();
    return result;
  }

  public async findAll(userId: number): Promise<AuthEvent[]> {
    const authEvents = await this.authEventRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
    return authEvents;
  }
  public async update(
    id: number,
    updateAuthEventDto: UpdateAuthEventDto,
  ): Promise<UpdateResult> {
    return await this.authEventRepository.update(id, updateAuthEventDto);
  }
}
