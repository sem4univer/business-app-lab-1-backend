import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Office } from './entities/office.entity';
import { Role } from './entities/role.entity';

@Injectable()
export class UserRelationService {
  constructor(
    @InjectRepository(Office) private officeRepository: Repository<Office>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  public async getAllOffices(): Promise<Office[]> {
    return await this.officeRepository.find({});
  }

  public async getAllRoles(): Promise<Role[]> {
    console.log('getAllRoles');
    return await this.roleRepository.find({
      relations: {
        user: false,
      },
    });
  }
}
