export interface Venue {
  name: string;
  city: string;
  state: string;
}

export interface Team {
  name: string;
  alias: string;
  record: {
    wins: number;
    losses: number;
  };
}

export interface Game {
  id: string;
  status: string;
  scheduled: string;
  venue: Venue;
  home: Team;
  away: Team;
  broadcast: {
    network: string;
  };
}