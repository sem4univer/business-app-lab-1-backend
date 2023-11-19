import { Country } from './../../users/entities/country.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Airport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Country)
  @JoinColumn()
  country: Country;

  @Column({ type: 'varchar', length: 3 })
  IATACode: string;

  @Column()
  name: string;
}
