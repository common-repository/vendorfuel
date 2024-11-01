import angular from 'angular';
import { SearchBar } from './search-bar.component';

export const SearchModule = angular
	.module('SearchModule', [])
	.component('vfSearchBar', SearchBar).name;
