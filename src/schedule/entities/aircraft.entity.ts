import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Aircraft {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  makeModel: string;

  @Column()
  totalSeats: number;

  @Column()
  economySeats: number;

  @Column()
  businessSeats: number;
}
