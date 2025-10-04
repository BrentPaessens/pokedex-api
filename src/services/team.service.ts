import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Team } from './team.entity';
import { Pokemon } from '../pokemon/pokemon.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) {}

  async findAll(): Promise<any[]> {
    const teams = await this.teamRepository.find({ relations: ['pokemons'] });
    return teams.map(team => ({
      id: team.id,
      name: team.name,
      pokemons: team.pokemons.map(p => p.id),
    }));
  }

  async findOne(id: number): Promise<any> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['pokemons'],
    });

    if (!team) {
      throw new NotFoundException({
        error: 'Not Found',
        error_message: `Team with id ${id} not found`,
      });
    }

    return {
      id: team.id,
      name: team.name,
      pokemons: team.pokemons.map(p => p.id),
    };
  }

  async create(name: string): Promise<any> {
    const team = this.teamRepository.create({ name, pokemons: [] });
    const saved = await this.teamRepository.save(team);
    
    return {
      id: saved.id,
      name: saved.name,
      pokemons: [],
    };
  }

  async setPokemons(id: number, pokemonIds: number[]): Promise<any> {
    // Validatie: max 6 pokemon
    if (pokemonIds.length > 6) {
      throw new BadRequestException({
        error: 'Bad Request',
        error_message: 'A team can have a maximum of 6 Pokémon',
      });
    }

    const team = await this.teamRepository.findOne({ where: { id } });

    if (!team) {
      throw new NotFoundException({
        error: 'Not Found',
        error_message: `Team with id ${id} not found`,
      });
    }

    // Haal pokemon op
    const pokemons = await this.pokemonRepository.find({
      where: { id: In(pokemonIds) },
    });

    // Check of alle pokemon bestaan
    if (pokemons.length !== pokemonIds.length) {
      throw new BadRequestException({
        error: 'Bad Request',
        error_message: 'One or more Pokémon IDs are invalid',
      });
    }

    team.pokemons = pokemons;
    await this.teamRepository.save(team);

    return {
      id: team.id,
      name: team.name,
      pokemons: pokemonIds,
    };
  }
}