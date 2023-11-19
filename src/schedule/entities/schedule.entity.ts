import { Route } from './route.entity';
import { Aircraft } from './aircraft.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;

  @ManyToOne(() => Aircraft)
  @JoinColumn()
  aircraft: Aircraft;

  @ManyToOne(() => Route)
  @JoinColumn()
  route: Route;

  @Column()
  economyPrice: number;

  @Column()
  confirmed: boolean;

  @Column()
  flightNumber: string;
}
