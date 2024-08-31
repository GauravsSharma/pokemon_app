import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonCard from './PokemonCard';
import Loader from './Loader';

const PokemonList = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=50');
                const pokemonData = await Promise.all(
                    response.data.results.map(async (pokemon) => {
                        const pokemonRecord = await axios.get(pokemon.url);
                        return pokemonRecord.data;
                    })
                );
                setLoading(false);
                setPokemonList(pokemonData);
            } catch (error) {
                setLoading(false);
                console.log(error.message);
            }
        };

        fetchPokemon();
    }, []);
    // console.log(pokemonList);
    const filteredPokemon = pokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div>
            <input
                type="text"
                placeholder="Search Pokémon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='search_input'
            />
            <div className="pokemon-grid">
                {
                    filteredPokemon.map((pokemon) => (
                        <PokemonCard key={pokemon.id} pokemon={pokemon} />
                    ))
                }
                {loading && <Loader/>}
            </div>
        </div>
    );
};

export default PokemonList;
