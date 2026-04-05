import { create } from 'zustand';

export const KIDS = ['Milena', 'Valerio', 'Elina', 'Mio'] as const;
export const ADULTS = ['Carmen', 'Micha', 'Nicole', 'Mäthu'] as const;

export const TEAM_COLORS = [
  { name: 'red', hex: '#e94560', hsl: '350 80% 59%' },
  { name: 'blue', hex: '#4361ee', hsl: '228 85% 60%' },
  { name: 'green', hex: '#06d6a0', hsl: '161 96% 42%' },
  { name: 'gold', hex: '#ffd166', hsl: '44 100% 70%' },
] as const;

export const AVATAR_COLORS = [
  '#e94560', '#4361ee', '#06d6a0', '#ffd166',
  '#ff6b9d', '#845ef7', '#20c997', '#fab005',
];

export interface RaceResult {
  name: string;
  rank: number;
  gpPoints: number;
}

export interface Team {
  kid: string;
  adult: string;
  colorIndex: number;
  kidRank: number;
  adultRank?: number;
}

export interface MatchResult {
  results: RaceResult[];
  winnerTeamIndex: number;
  loserTeamIndex: number;
}

export const DEMO_KIDS_QUAL: RaceResult[] = [
  { name: 'Valerio', rank: 1, gpPoints: 52 },
  { name: 'Elina', rank: 2, gpPoints: 46 },
  { name: 'Milena', rank: 3, gpPoints: 38 },
  { name: 'Mio', rank: 4, gpPoints: 31 },
];

export const DEMO_DRAFT: [string, string][] = [
  ['Mio', 'Carmen'],
  ['Milena', 'Micha'],
  ['Elina', 'Mäthu'],
  ['Valerio', 'Nicole'],
];

export const DEMO_ADULTS_QUAL: RaceResult[] = [
  { name: 'Micha', rank: 1, gpPoints: 54 },
  { name: 'Carmen', rank: 2, gpPoints: 49 },
  { name: 'Mäthu', rank: 3, gpPoints: 41 },
  { name: 'Nicole', rank: 4, gpPoints: 33 },
];

export const DEMO_SF1: RaceResult[] = [
  { name: 'Milena', rank: 1, gpPoints: 18 },
  { name: 'Nicole', rank: 2, gpPoints: 14 },
  { name: 'Micha', rank: 3, gpPoints: 12 },
  { name: 'Valerio', rank: 4, gpPoints: 9 },
];

export const DEMO_SF2: RaceResult[] = [
  { name: 'Carmen', rank: 1, gpPoints: 17 },
  { name: 'Elina', rank: 2, gpPoints: 15 },
  { name: 'Mäthu', rank: 3, gpPoints: 11 },
  { name: 'Mio', rank: 4, gpPoints: 10 },
];

export const DEMO_SMALL_FINAL: RaceResult[] = [
  { name: 'Valerio', rank: 1, gpPoints: 16 },
  { name: 'Mäthu', rank: 2, gpPoints: 14 },
  { name: 'Elina', rank: 3, gpPoints: 11 },
  { name: 'Nicole', rank: 4, gpPoints: 8 },
];

export const DEMO_GRAND_FINAL: RaceResult[] = [
  { name: 'Micha', rank: 1, gpPoints: 19 },
  { name: 'Carmen', rank: 2, gpPoints: 15 },
  { name: 'Milena', rank: 3, gpPoints: 14 },
  { name: 'Mio', rank: 4, gpPoints: 9 },
];

export interface TeamRanking {
  team: Team;
  kidRankPoints: number;
  adultRankPoints: number;
  totalRankPoints: number;
  totalGpPoints: number;
  rank: number;
}

interface TournamentState {
  isPreview: boolean;
  currentScreen: number;

  kidsQualification: RaceResult[];
  teams: Team[];
  draftStep: number;
  adultsQualification: RaceResult[];
  
  sf1Results: RaceResult[];
  sf2Results: RaceResult[];
  smallFinalResults: RaceResult[];
  grandFinalResults: RaceResult[];

  setPreview: (v: boolean) => void;
  setScreen: (n: number) => void;
  nextScreen: () => void;
  prevScreen: () => void;

  setKidsQualification: (r: RaceResult[]) => void;
  setAdultsQualification: (r: RaceResult[]) => void;
  addTeam: (kid: string, adult: string) => void;
  setDraftStep: (n: number) => void;
  setSf1Results: (r: RaceResult[]) => void;
  setSf2Results: (r: RaceResult[]) => void;
  setSmallFinalResults: (r: RaceResult[]) => void;
  setGrandFinalResults: (r: RaceResult[]) => void;

  resetAll: () => void;
  loadDemoData: () => void;

  getTeamRankings: () => TeamRanking[];
  getTeamByMember: (name: string) => Team | undefined;
  getTeamColor: (team: Team) => typeof TEAM_COLORS[number];
  getSfMatchups: () => { sf1: [TeamRanking, TeamRanking]; sf2: [TeamRanking, TeamRanking] } | null;
  getMatchWinner: (results: RaceResult[], teamA: Team, teamB: Team) => { winner: Team; loser: Team; teamAPoints: number; teamBPoints: number; teamAGp: number; teamBGp: number; tiebreak: boolean } | null;
}

const TOTAL_SCREENS = 15;

const initialState = {
  isPreview: true,
  currentScreen: 0,
  kidsQualification: [] as RaceResult[],
  teams: [] as Team[],
  draftStep: 0,
  adultsQualification: [] as RaceResult[],
  sf1Results: [] as RaceResult[],
  sf2Results: [] as RaceResult[],
  smallFinalResults: [] as RaceResult[],
  grandFinalResults: [] as RaceResult[],
};

export const useTournamentStore = create<TournamentState>((set, get) => ({
  ...initialState,

  setPreview: (v) => set({ isPreview: v }),
  setScreen: (n) => set({ currentScreen: Math.max(0, Math.min(TOTAL_SCREENS - 1, n)) }),
  nextScreen: () => set((s) => ({ currentScreen: Math.min(TOTAL_SCREENS - 1, s.currentScreen + 1) })),
  prevScreen: () => set((s) => ({ currentScreen: Math.max(0, s.currentScreen - 1) })),

  setKidsQualification: (r) => set({ kidsQualification: r }),
  setAdultsQualification: (r) => set({ adultsQualification: r }),
  addTeam: (kid, adult) => {
    const state = get();
    const kidResult = state.kidsQualification.find(r => r.name === kid);
    const newTeam: Team = {
      kid,
      adult,
      colorIndex: state.teams.length,
      kidRank: kidResult?.rank ?? 0,
    };
    set({ teams: [...state.teams, newTeam] });
  },
  setDraftStep: (n) => set({ draftStep: n }),
  setSf1Results: (r) => set({ sf1Results: r }),
  setSf2Results: (r) => set({ sf2Results: r }),
  setSmallFinalResults: (r) => set({ smallFinalResults: r }),
  setGrandFinalResults: (r) => set({ grandFinalResults: r }),

  resetAll: () => set({ ...initialState, isPreview: false, currentScreen: 1 }),

  loadDemoData: () => {
    const teams: Team[] = DEMO_DRAFT.map(([kid, adult], i) => {
      const kidResult = DEMO_KIDS_QUAL.find(r => r.name === kid);
      return { kid, adult, colorIndex: i, kidRank: kidResult?.rank ?? 0 };
    });
    // Set adult ranks
    DEMO_ADULTS_QUAL.forEach(ar => {
      const t = teams.find(t => t.adult === ar.name);
      if (t) t.adultRank = ar.rank;
    });

    set({
      isPreview: true,
      kidsQualification: DEMO_KIDS_QUAL,
      teams,
      draftStep: 4,
      adultsQualification: DEMO_ADULTS_QUAL,
      sf1Results: DEMO_SF1,
      sf2Results: DEMO_SF2,
      smallFinalResults: DEMO_SMALL_FINAL,
      grandFinalResults: DEMO_GRAND_FINAL,
    });
  },

  getTeamByMember: (name) => {
    return get().teams.find(t => t.kid === name || t.adult === name);
  },

  getTeamColor: (team) => TEAM_COLORS[team.colorIndex % TEAM_COLORS.length],

  getTeamRankings: () => {
    const { teams, kidsQualification, adultsQualification } = get();
    if (teams.length < 4 || adultsQualification.length < 4) return [];

    const rankings: TeamRanking[] = teams.map(team => {
      const kidResult = kidsQualification.find(r => r.name === team.kid);
      const adultResult = adultsQualification.find(r => r.name === team.adult);
      const kidRank = kidResult?.rank ?? 0;
      const adultRank = adultResult?.rank ?? 0;
      const kidGp = kidResult?.gpPoints ?? 0;
      const adultGp = adultResult?.gpPoints ?? 0;
      return {
        team: { ...team, adultRank: adultRank },
        kidRankPoints: kidRank,
        adultRankPoints: adultRank,
        totalRankPoints: kidRank + adultRank,
        totalGpPoints: kidGp + adultGp,
        rank: 0,
      };
    });

    rankings.sort((a, b) => {
      if (a.totalRankPoints !== b.totalRankPoints) return a.totalRankPoints - b.totalRankPoints;
      return b.totalGpPoints - a.totalGpPoints; // higher GP = better
    });

    rankings.forEach((r, i) => { r.rank = i + 1; });
    return rankings;
  },

  getSfMatchups: () => {
    const rankings = get().getTeamRankings();
    if (rankings.length < 4) return null;
    return {
      sf1: [rankings[0], rankings[3]],
      sf2: [rankings[1], rankings[2]],
    };
  },

  getMatchWinner: (results, teamA, teamB) => {
    if (results.length < 4) return null;
    const teamAMembers = [teamA.kid, teamA.adult];
    const teamBMembers = [teamB.kid, teamB.adult];

    let teamAPoints = 0, teamBPoints = 0, teamAGp = 0, teamBGp = 0;
    results.forEach(r => {
      if (teamAMembers.includes(r.name)) { teamAPoints += r.rank; teamAGp += r.gpPoints; }
      if (teamBMembers.includes(r.name)) { teamBPoints += r.rank; teamBGp += r.gpPoints; }
    });

    const tiebreak = teamAPoints === teamBPoints;
    let winner: Team, loser: Team;
    if (teamAPoints < teamBPoints) { winner = teamA; loser = teamB; }
    else if (teamBPoints < teamAPoints) { winner = teamB; loser = teamA; }
    else { winner = teamAGp >= teamBGp ? teamA : teamB; loser = winner === teamA ? teamB : teamA; }

    return { winner, loser, teamAPoints, teamBPoints, teamAGp, teamBGp, tiebreak };
  },
}));
