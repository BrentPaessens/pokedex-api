import { Command, Console } from 'nestjs-console';
import { Injectable } from '@nestjs/common';
import { PokemonService } from '../services/pokemon.service';
import * as fs from 'fs';
import * as path from 'path';

@Console()
@Injectable()
export class SeedCommand {
  constructor(private readonly pokemonService: PokemonService) {}

  @Command({
    command: 'seed:pokemon',
    description: 'Import Pokemon from pokemon.json file',
  })
  async seedPokemon(): Promise<void> {
    console.log('Starting Pokemon import...');

    try {
      // Lees pokemon.json file
      const filePath = path.join(process.cwd(), 'pokemon.json');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const pokemonData = JSON.parse(fileContent);

      // Transform data naar database format
      const pokemons = pokemonData.map((pokemon: any) => ({
        id: pokemon.id,
        name: pokemon.name,
        sprites: {
          front_default: pokemon.sprites?.front_default,
          front_female: pokemon.sprites?.front_female,
          front_shiny: pokemon.sprites?.front_shiny,
          front_shiny_female: pokemon.sprites?.front_shiny_female,
          back_default: pokemon.sprites?.back_default,
          back_female: pokemon.sprites?.back_female,
          back_shiny: pokemon.sprites?.back_shiny,
          back_shiny_female: pokemon.sprites?.back_shiny_female,
        },
        types: pokemon.types?.map((t: any) => ({
          type: { name: t.type?.name || t.type },
          slot: t.slot,
        })),
        height: pokemon.height,
        weight: pokemon.weight,
        moves: pokemon.moves?.map((m: any) => ({
          move: m.move?.name || m.move,
          version_group_details: m.version_group_details,
        })),
        order: pokemon.order,
        species: pokemon.species?.name || pokemon.species,
        stats: pokemon.stats?.map((s: any) => ({
          stat: s.stat?.name || s.stat,
          base_stat: s.base_stat,
          effort: s.effort,
        })),
        abilities: pokemon.abilities?.map((a: any) => ({
          ability: a.ability?.name || a.ability,
          is_hidden: a.is_hidden,
          slot: a.slot,
        })),
        form: pokemon.forms?.[0]?.name || pokemon.form,
      }));

      // Bulk insert
      await this.pokemonService.bulkCreate(pokemons);

      console.log(`✅ Successfully imported ${pokemons.length} Pokemon!`);
    } catch (error) {
      console.error('❌ Error importing Pokemon:', error.message);
      throw error;
    }
  }
}