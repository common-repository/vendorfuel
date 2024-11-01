import angular from 'angular';
import { FavoritesListItem } from './favorites-list-item.component';
import { FavoritesList } from './favorites-list.component';
import { FavoritesPage } from './favorites.component';
import { favoritesService } from './favorites.service';

export const FavoritesModule = angular
	.module('FavoritesModule', [])
	.component('vfFavorites', FavoritesPage)
	.component('favoritesList', FavoritesList)
	.component('favoritesListItem', FavoritesListItem)
	.service('Favorites', favoritesService).name;
