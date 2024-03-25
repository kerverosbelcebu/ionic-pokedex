import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPokemonsPage } from './list-pokemons.page';
import { PokemonService } from 'src/app/services/pokemon.service';

const routes: Routes = [
  {
    path: '',
    component: ListPokemonsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[PokemonService]
})
export class ListPokemonsPageRoutingModule {}
