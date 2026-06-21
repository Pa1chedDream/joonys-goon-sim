/**
 * Types for Joonys Analyse-Stunde
 */

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  subject: "Geschichte" | "Deutsch";
  subSubject: string; // e.g., "Romantik", "Vormärz (Karlsbader Beschlüsse)", "Kaiserreich", "Expressionismus", "Französische Revolution"
  description: string; // Brief context for the student
  taskDescription: string; // The specific school task description (e.g. "Analysiere die Bildelemente und interpretiere die Karikatur im historischen Kontext...")
  imageUrl: string;
  historicalContext: string; // Detailed facts Gemini uses to grade the user
  gradingPrompts: {
    excellentPoints: string[];
    goodPoints: string[];
  };
}

export interface AnalysisEvaluation {
  score: number; // 0 to 100
  grade: string; // "1+" to "6"
  funnyTeacherComment: string; // German streamer/teacher style comment
  academicFeedback: string; // Constructive feedback on style and content
  historicalAccuracies: string[];
  missedPoints: string[];
  subScores: {
    inhaltlich: number; // 0-30 points
    stilMittel: number; // 0-35 points
    historischerBezug: number; // 0-35 points
  };
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  artworkTitle: string;
  artworkId: string;
  subject: "Geschichte" | "Deutsch";
  score: number;
  grade: string;
  userType: "player" | "bot";
  playedAt: string;
}
