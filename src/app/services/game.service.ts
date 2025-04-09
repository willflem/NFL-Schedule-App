import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  getGames(): Observable<Game[]> {
    // This service is currently unused since the data is hardcoded in App component
    // We can remove this file entirely, but keeping it for future API integration
    return of([]);
  }
}