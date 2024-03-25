import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Pokemon } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
})
export class ListPokemonsPage implements OnInit {
  public pokemons: Pokemon[];
  constructor(private pokemonService:PokemonService,
    private navParams:NavParams,
    private navController:NavController) { 
    this.pokemons=[];
  }

  ngOnInit() {
    this.morePokemon();
  }
  morePokemon(){
    this.pokemonService.getPokemons().then((result:Pokemon[]|null)=>{
      if(result !== null){
        console.log(result);
        this.pokemons=this.pokemons.concat(result);
        console.log(this.pokemons);
      }
      else{
        console.error('Error...!!!');
      }
    }).catch(error=>{
      console.error("error...!!!!!!!");
    });
  }


  goToDetail(pokemon:Pokemon){
    this.navParams.data["pokemon"]=pokemon;
    this.navController.navigateForward("detail-pokemons");
  }
}
