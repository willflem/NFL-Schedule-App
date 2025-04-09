import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-card" (click)="navigateToDetails()">
      <div class="status-bar" [ngClass]="game.status.toLowerCase()">
        {{ getStatusText() }}
      </div>
      <div class="game-content">
        <div class="team-info">
          <div class="team" [class.losing-team]="game.status === 'FINAL' && isLosingTeam('away')">
            <img [src]="'https://static.www.nfl.com/t_headshot_desktop_2x/league/api/clubs/logos/' + game.away.alias" 
                 [alt]="game.away.name + ' logo'"
                 class="team-logo"
                 [class.grayscale]="game.status === 'FINAL' && isLosingTeam('away')"
                 loading="lazy">
            <span class="team-location">{{ game.away.alias }}</span>
            <span class="team-name">{{ game.away.name }}</span>
            <span class="record">({{ game.away.record.wins }}-{{ game.away.record.losses }})</span>
          </div>
          <ng-container [ngSwitch]="game.status">
            <span class="game-time" *ngSwitchCase="'SCHEDULED'">
              {{ formatGameTime(game.scheduled) }}
            </span>
            <div class="score-container" *ngSwitchDefault>
              <span class="score" [class.losing-score]="isLosingTeam('away')" [class.winning-score]="!isLosingTeam('away')">{{ getAwayScore() }}</span>
              <span class="score-divider">-</span>
              <span class="score" [class.losing-score]="isLosingTeam('home')" [class.winning-score]="!isLosingTeam('home')">{{ getHomeScore() }}</span>
            </div>
          </ng-container>
          <div class="team" [class.losing-team]="game.status === 'FINAL' && isLosingTeam('home')">
            <img [src]="'https://static.www.nfl.com/t_headshot_desktop_2x/league/api/clubs/logos/' + game.home.alias" 
                 [alt]="game.home.name + ' logo'"
                 class="team-logo"
                 [class.grayscale]="game.status === 'FINAL' && isLosingTeam('home')"
                 loading="lazy">
            <span class="team-location">{{ game.home.alias }}</span>
            <span class="team-name">{{ game.home.name }}</span>
            <span class="record">({{ game.home.record.wins }}-{{ game.home.record.losses }})</span>
          </div>
        </div>
        <div class="venue-info">
          {{ game.venue.name }} • {{ game.venue.city }}, {{ game.venue.state }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .game-card {
      background: #1a1a1a;
      border-radius: 8px;
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .game-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .status-bar {
      padding: 4px 8px;
      text-align: center;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .status-bar.scheduled {
      background-color: #b8860b;
    }

    .status-bar.final {
      background-color: #006400;
    }

    .status-bar.in_progress {
      background-color: #dc3545;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.8; }
      100% { opacity: 1; }
    }

    .game-content {
      padding: 16px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .team-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      gap: 16px;
    }

    .team {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      flex: 1;
      transition: color 0.3s ease;
    }

    .losing-team {
      color: #666;
    }

    .team-logo {
      width: 60px;
      height: 60px;
      margin-bottom: 8px;
      transition: filter 0.3s ease;
    }

    .team-logo.grayscale {
      filter: grayscale(100%) opacity(0.7);
    }

    .team-location {
      font-size: 12px;
      color: #888;
    }

    .team-name {
      font-size: 18px;
      font-weight: bold;
      margin: 4px 0;
    }

    .record {
      font-size: 12px;
      color: #888;
    }

    .score-container {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 24px;
      font-weight: bold;
    }

    .score {
      font-size: 24px;
      font-weight: bold;
      transition: color 0.3s ease;
    }

    .losing-score {
      color: #666;
    }

    .winning-score {
      color: #ffffff;
    }

    .game-time {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }

    .venue-info {
      font-size: 12px;
      color: #888;
      text-align: center;
      margin-top: auto;
    }

    @media (max-width: 768px) {
      .team-logo {
        width: 50px;
        height: 50px;
      }

      .team-name {
        font-size: 16px;
      }

      .score {
        font-size: 20px;
      }

      .game-time {
        font-size: 16px;
      }
    }
  `]
})
export class GameCardComponent {
  @Input() game!: Game;

  constructor(private router: Router) {}

  private readonly STATUS_MAP: Record<string, string> = {
    SCHEDULED: 'UPCOMING',
    IN_PROGRESS: 'LIVE',
    FINAL: 'FINAL'
  };

  private readonly SCORES: Record<string, string> = {
    '2': '24 - 17', // Packers vs Vikings
    '3': '31 - 14', // Rams vs Cardinals
    '5': '21 - 28', // Cowboys vs Eagles
    '6': '27 - 10', // 49ers vs Browns
    default: '20 - 15'
  };

  getStatusText(): string {
    return this.STATUS_MAP[this.game.status] || this.game.status;
  }

  getScore(): string {
    return this.SCORES[this.game.id] || this.SCORES['default'];
  }

  getHomeScore(): string {
    return this.getScore().split(' - ')[0];
  }

  getAwayScore(): string {
    return this.getScore().split(' - ')[1];
  }

  isLosingTeam(type: 'home' | 'away'): boolean {
    if (this.game.status === 'SCHEDULED') return false;
    
    const [homeScore, awayScore] = this.getScore().split(' - ').map(Number);
    return type === 'home' ? homeScore < awayScore : awayScore < homeScore;
  }

  formatGameTime(scheduled: string): string {
    const date = new Date(scheduled);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  navigateToDetails() {
    this.router.navigate(['/game', this.game.id]);
  }
}