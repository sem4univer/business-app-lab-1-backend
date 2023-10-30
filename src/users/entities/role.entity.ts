import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
