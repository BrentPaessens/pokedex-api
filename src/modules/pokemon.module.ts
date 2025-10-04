import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './../entities/pokemon.entity';
import { PokemonService } from '../services/pokemon.service';
import { PokemonController } from '../controllers/pokemon.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon])],
  controllers: [PokemonController],
  providers: [PokemonService],
  exports: [PokemonService],
})
export class PokemonModule {}