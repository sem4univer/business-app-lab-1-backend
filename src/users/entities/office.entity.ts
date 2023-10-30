import {
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { Country } from './country.entity';

/**
 * @docs https://drive.google.com/drive/folders/1DtKeBMOdSSp1uey8nriTZxPK7h_6YY_c
 * @structure https://imgur.com/a/9Kveo54
 */
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
