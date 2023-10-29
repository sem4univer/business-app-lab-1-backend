import {
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { Country } from './country.entity';

@Entity()
export class Office {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Country)
  @JoinColumn()
  country: Country;

  @Column({ type: 'varchar', length: '50' })
  title: string;

  @Column({ type: 'varchar', length: '50' })
  phone: string;

  @Column({ type: 'varchar', length: '250' })
  contact: string;
}
