import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Airport } from './airport.entity';

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Airport)
  @JoinColumn()
  departureAirport: Airport;

  @ManyToOne(() => Airport)
  @JoinColumn()
  arrivalAirport: Airport;

  @Column()
  distance: number;

  @Column()
  flightTime: number;
}
