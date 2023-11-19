import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';

import { Country } from './country.entity';
import { Role } from './role.entity';
import { getHashedPassword } from '../users.utils';
import { ApiProperty } from '@nestjs/swagger';
import { Office } from './office.entity';

/**
 * @docs https://drive.google.com/drive/folders/1DtKeBMOdSSp1uey8nriTZxPK7h_6YY_c
 * @structure https://imgur.com/a/9Kveo54
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  @ApiProperty()
  email: string;

  @Column({ type: 'varchar', length: 50, select: false })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty()
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty()
  lastName: string;

  @Column()
  @ApiProperty()
  active: number;

  @Column({ type: 'date', nullable: true, default: null })
  @ApiProperty()
  birthdate: Date;

  @ApiProperty()
  @ManyToOne((type) => Role, { nullable: true })
  @JoinColumn()
  role: Role;

  @ManyToOne((type) => Country)
  @JoinColumn()
  @ApiProperty({ nullable: true })
  country?: Country;

  @ManyToOne((type) => Office)
  @JoinColumn()
  @ApiProperty()
  office: Office;

  @Column({ default: false })
  @ApiProperty()
  isBlocked: boolean;

  @Column({ default: null, nullable: true })
  @ApiProperty({ default: null, nullable: true })
  lastFailedLoginTime?: Date;

  @Column({ default: null, nullable: true })
  @ApiProperty({
    description:
      'Time for waiting before login api will be work in miliseconds',
  })
  timeToWaitBeforeLoginMs?: number;

  @Column({ default: null, nullable: true })
  @ApiProperty()
  lastFailedLoginCount?: number;

  @BeforeInsert()
  async hashPassword() {
    const hashedPassword = getHashedPassword(this.password);
    this.password = hashedPassword;
  }
}
