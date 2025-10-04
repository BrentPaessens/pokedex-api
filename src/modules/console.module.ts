import { Module } from '@nestjs/common';
import { ConsoleModule as NestConsoleModule } from 'nestjs-console';
import { PokemonModule } from '../modules/pokemon.module';
import { SeedCommand } from '../seeders/seed.command';
import { ImportCommand } from './import.command';

@Module({
  imports: [NestConsoleModule, PokemonModule],
  providers: [SeedCommand, ImportCommand],
})
export class ConsoleModule {}