import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Pokemon } from './pokemon.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Pokemon, (pokemon) => pokemon.teams)
  @JoinTable()
  pokemons: Pokemon[];
}