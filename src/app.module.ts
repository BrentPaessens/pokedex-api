import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonModule} from './pokemon/pokemon.module';
import { TeamModule } from './team/team.module';


// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'pokedex',
      autoLoadEntities: true,
      synchronize: true, // Note: set to false in production
    }),
    PokemonModule,
    TeamModule,
  ],
})
export class AppModule {}
