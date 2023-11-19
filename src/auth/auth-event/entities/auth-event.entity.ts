import { User } from '../../../users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum AuthEventType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  ERROR = 'ERROR',
}

@Entity()
export class AuthEvent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventType: AuthEventType;

  @Column({ default: null, nullable: true })
  isError?: boolean;

  @Column({ default: null, nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @ManyToOne((type) => User)
  @JoinColumn()
  user: User;
}
