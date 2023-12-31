import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

/**
 * @docs https://drive.google.com/drive/folders/1DtKeBMOdSSp1uey8nriTZxPK7h_6YY_c
 * @structure https://imgur.com/a/9Kveo54
 */
@Entity()
export class Role {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @OneToMany((type) => User, (user) => user.role)
  @JoinColumn()
  user: User;
}
