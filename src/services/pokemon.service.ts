import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Pokemon } from "../entities/pokemon.entity";

@Injectable()
export class PokemonService {
    constructor(
        @InjectRepository(Pokemon)
        private readonly pokemonRepository: Repository<Pokemon>,
    ) {}

    async findAll(sort?: string): Promise<Pokemon[]> {
        const order: any = {};

        if (sort === 'name-asc') order.name = 'ASC';
        if (sort === 'name-desc') order.name = 'DESC';
        if (sort === 'id-asc') order.id = 'ASC';
        if (sort === 'id-desc') order.id = 'DESC';

        return this.pokemonRepository.find({ order });
    }

    async findAllPaginated(
        sort?: string,
        limit: number = 20,
        offset: number = 0):
        Promise<{ data: Pokemon[];
            metadata: {
                next: string | null;
                previous: string | null;
                total: number;
                pages: number;
                page: number;
            };
        }> {
        const order: any = {};
        if (sort === 'name-asc') order.name = 'ASC';
        if (sort === 'name-desc') order.name = 'DESC';
        if (sort === 'id-asc') order.id = 'ASC';
        if (sort === 'id-desc') order.id = 'DESC';

        const [data, total] = await this.pokemonRepository.findAndCount({
            order,
            take: limit,
            skip: offset,
        });

        const pages = Math.ceil(total / limit);
        const currentPage = Math.floor(offset / limit) + 1;

        const baseUrl = '/api/v2/pokemons';
        const buildUrl = (newOffset: number) => 
            `${baseUrl}?limit=${limit}&offset=${newOffset}${sort ? `&sort=${sort}` : ''}`;

        return {
            data,
            metadata: {
                next: offset + limit < total ? buildUrl(offset + limit) : null,
                previous: offset > 0 ? buildUrl(Math.max(0, offset - limit)) : null,
                total,
                pages,
                page: currentPage,
            },
        };
    }

    async findOne(id: number): Promise<Pokemon> {
        const pokemon = await this.pokemonRepository.findOne({ where: { id } });

        if (!pokemon) {
            throw new NotFoundException(`Pokemon with ID ${id} not found`);
        }

        return pokemon;
    }

    async search(querry: string, limit?: number): Promise<Pokemon[]> {
        // zoek naar naam of type
        const pokemons = await this.pokemonRepository
            .createQueryBuilder('pokemon')
            .where('LOWER(pokemon.name) LIKE LOWER(:querry)', { querry: `%${querry}%` })
            .orWhere("EXISTS (SELECT 1 FROM jsonb_array_elements(pokemon.types) AS type WHERE LOWER(type->'type'->>'name') LIKE LOWER(:querry))", { querry: `%${querry}%` })
            .limit(limit || 100)
            .getMany();

        return pokemons;
    }

    async create(pokemonData: Partial<Pokemon>): Promise<Pokemon> {
        const newPokemon = this.pokemonRepository.create(pokemonData);
        return this.pokemonRepository.save(newPokemon);
    }

    async bulkCreate(pokemons: Partial<Pokemon>[]): Promise<void> {
        await this.pokemonRepository.save(pokemons);
    }
}