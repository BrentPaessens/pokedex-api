import { Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { PokemonService } from '../services/pokemon.service';
import axios from 'axios';

@Console()
@Injectable()
export class ImportCommand { } // ← moet export hebben