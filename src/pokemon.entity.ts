import { Entity, Column, PrimaryColumn, ManyToMany } from "typeorm";

@Entity('pokemons')
export class Pokemon {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column('jsonb', { nullable: true })
  sprites: {
    front_default?: string;
    front_female?: string;
    front_shiny?: string;
    front_shiny_female?: string;
    back_default?: string;
    back_female?: string;
    back_shiny?: string;
    back_shiny_female?: string;
  };

  @Column('jsonb')
  types: Array<{
    type: { name: string};
    slot: number;
  }>;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  weight: number;

  @Column('jsonb', { nullable: true })
  moves: Array<{
    move: string;
    version_group_details: Array<{
        move_learn_method: string;
        version_group: string;
        level_learned_at: number;
    }>;
  }>;

  @Column({ nullable: true })
  order: number;

  @Column({ nullable: true })
  species: string;

  @Column('jsonb', { nullable: true })
  stats: Array<{
    stat: string;
    base_stat: number;
    effort: number;
  }>;

  @Column('jsonb', { nullable: true })
  abilities: Array<{
    ability: string;
    is_hidden: boolean;
    slot: number;
  }>;

  @Column({ nullable: true })
  form: string;

  @ManyToMany(() => Team, (team) => team.pokemons)
  teams: Team[];
 
}
