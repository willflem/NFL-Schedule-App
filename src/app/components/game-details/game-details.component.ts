import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" *ngIf="game">
      <button class="back-button" (click)="goBack()">← Back to Games</button>
      
      <div class="game-header">
        <div class="status" [ngClass]="game.status.toLowerCase()">
          {{ getStatusText() }}
        </div>
        <div class="broadcast" *ngIf="game.broadcast?.network">
          Watch on {{ game.broadcast.network }}
        </div>
      </div>

      <div class="teams-container">
        <div class="team" [class.losing-team]="isLosingTeam('away')">
          <img [src]="'https://static.www.nfl.com/t_headshot_desktop_2x/league/api/clubs/logos/' + game.away.alias" 
               [alt]="game.away.name + ' logo'"
               class="team-logo"
               [class.grayscale]="isLosingTeam('away')">
          <h2>{{ game.away.name }}</h2>
          <div class="record">{{ game.away.record.wins }} - {{ game.away.record.losses }}</div>
          <div class="score" *ngIf="game.status !== 'SCHEDULED'" [class.losing-score]="isLosingTeam('away')" [class.winning-score]="!isLosingTeam('away')">
            {{ getAwayScore() }}
          </div>
        </div>

        <div class="vs">
          <span *ngIf="game.status === 'SCHEDULED'">VS</span>
          <span *ngIf="game.status !== 'SCHEDULED'">{{ getStatusText() }}</span>
        </div>

        <div class="team" [class.losing-team]="isLosingTeam('home')">
          <img [src]="'https://static.www.nfl.com/t_headshot_desktop_2x/league/api/clubs/logos/' + game.home.alias" 
               [alt]="game.home.name + ' logo'"
               class="team-logo"
               [class.grayscale]="isLosingTeam('home')">
          <h2>{{ game.home.name }}</h2>
          <div class="record">{{ game.home.record.wins }} - {{ game.home.record.losses }}</div>
          <div class="score" *ngIf="game.status !== 'SCHEDULED'" [class.losing-score]="isLosingTeam('home')" [class.winning-score]="!isLosingTeam('home')">
            {{ getHomeScore() }}
          </div>
        </div>
      </div>

      <div class="team-comparison">
        <h3>Team Comparison</h3>
        <div class="comparison-grid">
          <div class="stat-row">
            <div class="stat-label">Win Percentage</div>
            <div class="stat-value" [class.highlight]="getWinPercentage(game.away) > getWinPercentage(game.home)">
              {{ (getWinPercentage(game.away) * 100).toFixed(1) }}%
            </div>
            <div class="stat-value" [class.highlight]="getWinPercentage(game.home) > getWinPercentage(game.away)">
              {{ (getWinPercentage(game.home) * 100).toFixed(1) }}%
            </div>
          </div>
          <div class="stat-row">
            <div class="stat-label">Games Played</div>
            <div class="stat-value">{{ getTotalGames(game.away) }}</div>
            <div class="stat-value">{{ getTotalGames(game.home) }}</div>
          </div>
          <div class="stat-row">
            <div class="stat-label">Current Streak</div>
            <div class="stat-value" [class.streak-win]="isWinningStreak(game.away)" [class.streak-loss]="!isWinningStreak(game.away)">
              {{ getStreak(game.away) }}
            </div>
            <div class="stat-value" [class.streak-win]="isWinningStreak(game.home)" [class.streak-loss]="!isWinningStreak(game.home)">
              {{ getStreak(game.home) }}
            </div>
          </div>
        </div>
      </div>

      <div class="team-details">
        <div class="team-section">
          <h3>{{ game.away.name }}</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">Team Code:</span>
              <span class="value">{{ game.away.alias }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Win Rate:</span>
              <span class="value">{{ (getWinPercentage(game.away) * 100).toFixed(1) }}%</span>
            </div>
            <div class="detail-item">
              <span class="label">Last 5 Games:</span>
              <span class="value">{{ getLastFiveGames(game.away) }}</span>
            </div>
          </div>
        </div>

        <div class="team-section">
          <h3>{{ game.home.name }}</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">Team Code:</span>
              <span class="value">{{ game.home.alias }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Win Rate:</span>
              <span class="value">{{ (getWinPercentage(game.home) * 100).toFixed(1) }}%</span>
            </div>
            <div class="detail-item">
              <span class="label">Last 5 Games:</span>
              <span class="value">{{ getLastFiveGames(game.home) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="venue-details">
        <h3>Venue Information</h3>
        <div class="venue-card">
          <div class="venue-name">{{ game.venue.name }}</div>
          <div class="venue-location">{{ game.venue.city }}, {{ game.venue.state }}</div>
          <div class="game-time">
            Scheduled: {{ formatGameTime(game.scheduled) }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
      color: white;
    }

    .back-button {
      background: none;
      border: 2px solid #666;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin-bottom: 24px;
      transition: all 0.3s ease;
    }

    .back-button:hover {
      background: #333;
      border-color: #888;
    }

    .game-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .status {
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .status.scheduled {
      background-color: #b8860b;
    }

    .status.final {
      background-color: #006400;
    }

    .status.in_progress {
      background-color: #dc3545;
      animation: pulse 2s infinite;
    }

    .broadcast {
      font-size: 18px;
      color: #888;
    }

    .teams-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 48px;
      padding: 32px;
      background: #1a1a1a;
      border-radius: 8px;
    }

    .team {
      text-align: center;
      flex: 1;
      transition: color 0.3s ease;
    }

    .losing-team {
      color: #666;
    }

    .team-logo {
      width: 120px;
      height: 120px;
      margin-bottom: 16px;
      transition: filter 0.3s ease;
    }

    .team-logo.grayscale {
      filter: grayscale(100%) opacity(0.7);
    }

    .vs {
      font-size: 24px;
      font-weight: bold;
      margin: 0 32px;
    }

    h2 {
      margin: 0;
      font-size: 28px;
      margin-bottom: 8px;
    }

    h3 {
      margin: 0 0 16px 0;
      font-size: 24px;
      color: #fff;
    }

    .record {
      font-size: 18px;
      color: #888;
      margin-bottom: 8px;
    }

    .score {
      font-size: 48px;
      font-weight: bold;
      transition: color 0.3s ease;
    }

    .losing-score {
      color: #666;
    }

    .winning-score {
      color: #ffffff;
    }

    .team-comparison {
      background: #1a1a1a;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
    }

    .comparison-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .stat-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #333;
    }

    .stat-label {
      color: #888;
    }

    .stat-value {
      text-align: center;
      font-weight: bold;
      transition: color 0.3s ease;
    }

    .highlight {
      color: #4CAF50;
    }

    .streak-win {
      color: #4CAF50;
    }

    .streak-loss {
      color: #f44336;
    }

    .team-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }

    .team-section {
      background: #1a1a1a;
      border-radius: 8px;
      padding: 24px;
    }

    .detail-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #333;
    }

    .label {
      color: #888;
    }

    .value {
      font-weight: bold;
    }

    .venue-details {
      background: #1a1a1a;
      border-radius: 8px;
      padding: 24px;
    }

    .venue-card {
      text-align: center;
    }

    .venue-name {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .venue-location {
      font-size: 18px;
      color: #888;
      margin-bottom: 8px;
    }

    .game-time {
      font-size: 16px;
      color: #666;
    }

    @media (max-width: 768px) {
      .teams-container {
        flex-direction: column;
        gap: 24px;
      }

      .vs {
        margin: 16px 0;
      }

      .team-logo {
        width: 80px;
        height: 80px;
      }

      h2 {
        font-size: 24px;
      }

      .score {
        font-size: 36px;
      }

      .team-details {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class GameDetailsComponent implements OnInit {
  game: Game | undefined;
  private readonly STATUS_MAP: Record<string, string> = {
    SCHEDULED: 'UPCOMING',
    IN_PROGRESS: 'LIVE',
    FINAL: 'FINAL'
  };

  private readonly SCORES: Record<string, string> = {
    '2': '17 - 24',
    '3': '31 - 14',
    '5': '28 - 21',
    '6': '27 - 10',
    default: '20 - 15'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const gameId = this.route.snapshot.paramMap.get('id');
    this.game = GAMES.find(g => g.id === gameId);
    
    if (!this.game) {
      this.router.navigate(['/']);
    }
  }

  getStatusText(): string {
    return this.game ? this.STATUS_MAP[this.game.status] || this.game.status : '';
  }

  getScore(): string {
    return this.game ? (this.SCORES[this.game.id] || this.SCORES['default']) : '';
  }

  getHomeScore(): string {
    return this.getScore().split(' - ')[0];
  }

  getAwayScore(): string {
    return this.getScore().split(' - ')[1];
  }

  isLosingTeam(type: 'home' | 'away'): boolean {
    if (!this.game || this.game.status === 'SCHEDULED') return false;
    
    const [homeScore, awayScore] = this.getScore().split(' - ').map(Number);
    return type === 'home' ? homeScore < awayScore : awayScore < homeScore;
  }

  getWinPercentage(team: { record: { wins: number; losses: number } }): number {
    const totalGames = team.record.wins + team.record.losses;
    return totalGames === 0 ? 0 : team.record.wins / totalGames;
  }

  getTotalGames(team: { record: { wins: number; losses: number } }): number {
    return team.record.wins + team.record.losses;
  }

  getStreak(team: { record: { wins: number; losses: number } }): string {
    const winPercentage = this.getWinPercentage(team);
    
    if (team.record.wins === 6 && team.record.losses === 0) return 'W6';
    if (team.record.wins === 5 && team.record.losses === 1) return 'W3';
    if (team.record.wins === 4 && team.record.losses === 2) return 'W2';
    if (team.record.wins === 3 && team.record.losses === 3) return 'L1';
    if (team.record.wins === 2 && team.record.losses === 4) return 'L2';
    if (team.record.wins === 1 && team.record.losses === 5) return 'L3';
    
    return winPercentage >= 0.5 ? 'W1' : 'L1';
  }

  isWinningStreak(team: { record: { wins: number; losses: number } }): boolean {
    return this.getStreak(team).startsWith('W');
  }

  getLastFiveGames(team: { record: { wins: number; losses: number } }): string {
    if (team.record.wins === 6 && team.record.losses === 0) {
      return 'W-W-W-W-W';
    }
    
    if (team.record.wins === 5 && team.record.losses === 1) {
      return 'W-W-W-L-W';
    }
    
    if (team.record.wins === 4 && team.record.losses === 2) {
      return 'L-W-W-L-W';
    }
    
    if (team.record.wins === 3 && team.record.losses === 3) {
      return 'W-L-W-L-L';
    }
    
    if (team.record.wins === 2 && team.record.losses === 4) {
      return 'L-L-W-L-W';
    }
    
    if (team.record.wins === 1 && team.record.losses === 5) {
      return 'L-L-L-W-L';
    }
    
    return 'L-L-L-L-L';
  }

  formatGameTime(scheduled: string): string {
    const date = new Date(scheduled);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}

const GAMES = [
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