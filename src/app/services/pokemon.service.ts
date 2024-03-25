import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Pokemon } from '../models/pokemon';
@Injectable()

export class PokemonService {
  private nextUrl: string;
  constructor() {
    this.nextUrl = 'https://pokeapi.co/api/v2/pokemon?offset==00&limit=20';
  }
  async getPokemons(): Promise<Pokemon[] | null> {
    const url = this.nextUrl;
    if (url) {
      const options = {
        url,
        headers: {},
        params: {}
      };
      try {
        const response = await CapacitorHttp.get(options);
        let pokemons: Pokemon[] = [];
        if (response.data) {
          const results = response.data.results;
          this.nextUrl = response.data.next;
          const promises: Promise<HttpResponse>[] = [];
          for (let index = 0; index < results.length; index++) {
            const pokemon = results[index];
            const urlPokemon = pokemon.url;
            const optionsPokemon = {
              url: urlPokemon,
              headers: {},
              params: {}
            };
            promises.push(CapacitorHttp.get(optionsPokemon));
          }
          const responses = await Promise.all(promises);
          for (const response of responses) {
            const pokemonData = response.data;
            const pokemonObj = new Pokemon();
            pokemonObj.id = pokemonData.order;
            pokemonObj.name = pokemonData.name;
            if (pokemonData.type && Array.isArray(pokemonData.type) && pokemonData.type.length >= 2) {
              pokemonObj.type2 = pokemonData.type[1].type.name;
            }
            pokemonObj.sprite = pokemonData.sprites.front_default;
            pokemonObj.weight = pokemonData.weight / 10;
            pokemonObj.height = pokemonData.height / 10;
            pokemonObj.stats = pokemonData.stats;
            pokemonObj.abilities = pokemonData.abilities
              .filter((ab: { is_hidden: any; }) => !ab.is_hidden)
              .map((ab: { ability: { name: any; }; }) => ab.ability.name);
            const hiddenAbility = pokemonData.abilities.find((ab: { is_hidden: any; }) => ab.is_hidden)
            if (hiddenAbility) {
              pokemonObj.hiddenAbility = hiddenAbility.ability.name;
            }
            pokemons.push(pokemonObj);
          }
        }
        return pokemons;
      } catch (error) {
        console.error('Error al buscar el pokemon de la bd: ', error);
        throw error;
      }
    }
    return null;
  }
}