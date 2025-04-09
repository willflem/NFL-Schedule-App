import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideRouter, RouterOutlet } from '@angular/router';
import { GameCardComponent } from './app/components/game-card/game-card.component';
import { GameDetailsComponent } from './app/components/game-details/game-details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GameCardComponent],
  template: `
    <div class="container">
      <header>
        <img src="https://static.www.nfl.com/image/upload/v1554321393/league/nvfr7ogywskqrfaiu38m.svg" 
             alt="NFL Logo" 
             class="nfl-logo">
        <h1>Schedule and Results</h1>
      </header>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #111;
      min-height: 100vh;
      color: white;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 32px;
      gap: 24px;
    }

    .nfl-logo {
      height: 60px;
    }

    h1 {
      font-size: 36px;
      margin: 0;
      font-weight: bold;
    }

    @media (max-width: 768px) {
      header {
        flex-direction: column;
        text-align: center;
      }

      h1 {
        font-size: 28px;
      }
    }
  `]
})
export class App {
  constructor() {}
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GameCardComponent],
  template: `
    <div class="games-grid">
      <app-game-card
        *ngFor="let game of games; trackBy: trackByGameId"
        [game]="game">
      </app-game-card>
    </div>
  `,
  styles: [`
    .games-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      max-width: 100%;
    }
  `]
})
export class HomeComponent {
  readonly games = [
    {
      id: '1',
      status: 'SCHEDULED',
      scheduled: '2024-10-13T13:00:00Z',
      venue: {
        name: 'TIAA Bank Field',
        city: 'Jacksonville',
        state: 'FL'
      },
      home: {
        name: 'Jaguars',
        alias: 'JAX',
        record: { wins: 4, losses: 2 }
      },
      away: {
        name: 'Bears',
        alias: 'CHI',
        record: { wins: 1, losses: 5 }
      },
      broadcast: {
        network: 'CBS'
      }
    },
    {
      id: '2',
      status: 'IN_PROGRESS',
      scheduled: '2024-10-13T16:05:00Z',
      venue: {
        name: 'Lambeau Field',
        city: 'Green Bay',
        state: 'WI'
      },
      home: {
        name: 'Packers',
        alias: 'GB',
        record: { wins: 3, losses: 3 }
      },
      away: {
        name: 'Vikings',
        alias: 'MIN',
        record: { wins: 2, losses: 4 }
      },
      broadcast: {
        network: 'FOX'
      }
    },
    {
      id: '3',
      status: 'FINAL',
      scheduled: '2024-10-13T13:00:00Z',
      venue: {
        name: 'SoFi Stadium',
        city: 'Los Angeles',
        state: 'CA'
      },
      home: {
        name: 'Rams',
        alias: 'LAR',
        record: { wins: 5, losses: 1 }
      },
      away: {
        name: 'Cardinals',
        alias: 'ARI',
        record: { wins: 1, losses: 5 }
      },
      broadcast: {
        network: 'FOX'
      }
    },
    {
      id: '4',
      status: 'SCHEDULED',
      scheduled: '2024-10-13T20:20:00Z',
      venue: {
        name: 'Arrowhead Stadium',
        city: 'Kansas City',
        state: 'MO'
      },
      home: {
        name: 'Chiefs',
        alias: 'KC',
        record: { wins: 6, losses: 0 }
      },
      away: {
        name: 'Broncos',
        alias: 'DEN',
        record: { wins: 1, losses: 5 }
      },
      broadcast: {
        network: 'NBC'
      }
    },
    {
      id: '5',
      status: 'IN_PROGRESS',
      scheduled: '2024-10-13T16:25:00Z',
      venue: {
        name: 'AT&T Stadium',
        city: 'Arlington',
        state: 'TX'
      },
      home: {
        name: 'Cowboys',
        alias: 'DAL',
        record: { wins: 4, losses: 2 }
      },
      away: {
        name: 'Eagles',
        alias: 'PHI',
        record: { wins: 5, losses: 1 }
      },
      broadcast: {
        network: 'FOX'
      }
    },
    {
      id: '6',
      status: 'FINAL',
      scheduled: '2024-10-13T13:00:00Z',
      venue: {
        name: 'Levi\'s Stadium',
        city: 'Santa Clara',
        state: 'CA'
      },
      home: {
        name: '49ers',
        alias: 'SF',
        record: { wins: 6, losses: 0 }
      },
      away: {
        name: 'Browns',
        alias: 'CLE',
        record: { wins: 3, losses: 3 }
      },
      broadcast: {
        network: 'CBS'
      }
    }
  ];

  trackByGameId(index: number, game: any): string {
    return game.id;
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter([
      { path: '', component: HomeComponent },
      { path: 'game/:id', component: GameDetailsComponent }
    ])
  ]
});