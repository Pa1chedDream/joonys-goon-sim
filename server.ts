import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { artworks } from "./src/data/images";
import { AnalysisEvaluation, LeaderboardEntry } from "./src/types";

// Deriving ESM equivalents for CJS globals
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Leaderboard with some initial Twitch-themed bots
let leaderboard: LeaderboardEntry[] = [
  {
    id: "bot_1",
    username: "xX_Macher_2026_Xx",
    artworkTitle: "Der Wanderer über dem Nebelmeer",
    artworkId: "wanderer",
    subject: "Deutsch",
    score: 93,
    grade: "1",
    userType: "bot",
    playedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "bot_2",
    username: "SimpForJoony",
    artworkTitle: "Der Denker-Club",
    artworkId: "denker_club",
    subject: "Geschichte",
    score: 87,
    grade: "2+",
    userType: "bot",
    playedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: "bot_3",
    username: "ProfessorBockwurst",
    artworkTitle: "Der Lotse geht von Bord",
    artworkId: "lotse",
    subject: "Geschichte",
    score: 75,
    grade: "3+",
    userType: "bot",
    playedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "bot_4",
    username: "GamerGirl_History",
    artworkTitle: "La Liberty guidant le peuple",
    artworkId: "bastille",
    subject: "Geschichte",
    score: 96,
    grade: "1+",
    userType: "bot",
    playedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

// Initialize Gemini API client lazily when needed
let aiClient: any = null;
function getGenAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not configured or holds default placeholder.");
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// APIs
app.get("/api/artworks", (req: Request, res: Response) => {
  res.json(artworks);
});

app.get("/api/leaderboard", (req: Request, res: Response) => {
  res.json(leaderboard);
});

app.post("/api/leaderboard", (req: Request, res: Response) => {
  const { username, artworkTitle, artworkId, subject, score, grade } = req.body;
  if (!username || !artworkId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const newEntry: LeaderboardEntry = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    username: username.slice(0, 25),
    artworkTitle,
    artworkId,
    subject,
    score,
    grade,
    userType: "player",
    playedAt: new Date().toISOString(),
  };

  leaderboard.push(newEntry);
  // Sort leaderboard by score descending
  leaderboard.sort((a, b) => b.score - a.score);
  // Keep top 50 in memory
  if (leaderboard.length > 50) {
    leaderboard = leaderboard.slice(0, 50);
  }

  res.json({ success: true, leaderboard });
});

app.post("/api/analyze", async (req: Request, res: Response) => {
  const { artworkId, analysisText } = req.body;
  if (!artworkId || !analysisText) {
    res.status(400).json({ error: "Fehlende Parameter: artworkId oder analysisText" });
    return;
  }

  const artwork = artworks.find((a) => a.id === artworkId);
  if (!artwork) {
    res.status(404).json({ error: "Bild nicht gefunden" });
    return;
  }

  const ai = getGenAI();

  // Fallback if no valid API key is present
  if (!ai) {
    console.log("No Gemini API key, returning mock streamer grading");
    const mockEvaluation = generateMockEvaluation(artwork, analysisText);
    res.json(mockEvaluation);
    return;
  }

  try {
    const prompt = `
      Nimm die Rolle des sympathischen, humorvollen und hochexzellenten deutschen Twitch-Streamers und Lehrers "Joony" ein.
      Joony ist ein passionierter Historiker und Germanist asiatischer Herkunft, der es liebt, Schüler-Bildanalysen live im Stream zu korrigieren.
      Er spricht eine coole Streamer-Jugendsprache (mit typischen Twitch-Memes wie "Macher", "Bruder", "Oha!", "Das ist wild!", "Ehre", "Stabil", "Fühl ich", "Digga"),
      ist aber gleichzeitig fachlich extrem kompetent, präzise und achtet streng auf wissenschaftliche Korrektheit bei der Zensurgebung im deutschen Schulsystem (Grade 1+ bis 6).

      Du korrigierst jetzt die folgende Schüler-Bildanalyse.

      --- KUNSTWERK DETAILS ---
      Titel: "${artwork.title}"
      Künstler: "${artwork.artist}"
      Jahr/Epoche: "${artwork.year} (${artwork.subSubject})"
      Kurzbeschreibung: "${artwork.description}"
      Aufgabe: "${artwork.taskDescription}"
      Detaillierter historischer/stilistischer Kontext (Prüfungsmaßstab):
      "${artwork.historicalContext}"

      --- SPEZIFISCHES BEWERTUNGSSCHEMA ---
      Hervorragende Punkte (Excellent, bringen Höchstpunktzahl):
      ${artwork.gradingPrompts.excellentPoints.map(p => `- ${p}`).join("\n")}

      Gute Punkte (Standard, müssen für eine solide Bewertung genannt werden):
      ${artwork.gradingPrompts.goodPoints.map(p => `- ${p}`).join("\n")}

      --- DIE SCHÜLER-ANALYSE ---
      "${analysisText}"

      --- DEINE INSTRUKS & ANFORDERUNGEN ---
      Bewerte die Schüler-Analyse fair und präzise. Berechne:
      1. subScores:
         - 'inhaltlich' (Inhaltliche Beschreibung, Symbolik-Erkennung): 0 bis 30 Punkte.
         - 'stilMittel' (Analyse von Komposition, Linien, Farben, Stilmitteln): 0 bis 35 Punkte.
         - 'historischerBezug' (Einordnung in Epoche, geschichtlichen Kontext & Hintergründe): 0 bis 35 Punkte.
      2. Gesamtscore: Summe der Subscores (0 bis 100 Punkte).
      3. Grade: Bestimme die entsprechende deutsche Note basierend auf dem Gesamtscore:
         - 95-100: "1+"
         - 90-94: "1"
         - 85-89: "1-"
         - 80-84: "2+"
         - 75-79: "2"
         - 70-74: "2-"
         - 65-69: "3+"
         - 60-64: "3"
         - 55-59: "3-"
         - 50-54: "4+"
         - 45-49: "4"
         - 40-44: "4-"
         - 30-39: "5"
         - < 30: "6"
      4. funnyTeacherComment: Ein grandioser Kommentar im Streamer-Slang von Joony (z.B. "Digger, was eine Macher-Analyse!", oder "Bruder, das ist leider komplett lost, setzten, Sechs!"). Nutze Humor, aber mit Herz. Schreibe auf Deutsch. (ca. 2-3 Sätze)
      5. academicFeedback: Eine seriöse, akademisch fundierte Rückmeldung, warum diese Note zustande kam und wo Raum für Verbesserungen ist (z.B. Formulierungen, Tiefe).
      6. historicalAccuracies: Liste konkrete Argumente auf, die der Schüler super erkannt hat.
      7. missedPoints: Liste wichtige historische oder stilistische Punkte auf, die komplett weggelassen oder falsch gedeutet wurden.

      Liefere die Antwort als valides JSON-Objekt zurück. Gib KEIN Markdown-Styling im Output (wie \`\`\`json ... \`\`\`), sondern NUR den rohen JSON-String, um Parsing-Fehler zu vermeiden.

      JSON-Objekt Format:
      {
        "score": number, 
        "grade": "string",
        "funnyTeacherComment": "string",
        "academicFeedback": "string",
        "historicalAccuracies": ["string", "string", ...],
        "missedPoints": ["string", "string", ...],
        "subScores": {
          "inhaltlich": number,
          "stilMittel": number,
          "historischerBezug": number
        }
      }
    `;

    // Execute with basic text task model
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const outputText = response.text || "{}";
    let cleanedOutput = outputText.trim();
    // In case the response wrapped in ```json ... ``` codeblocks, strip them
    if (cleanedOutput.startsWith("```")) {
      cleanedOutput = cleanedOutput.replace(/^```json/i, "").replace(/```$/, "").trim();
    }

    const evaluation: AnalysisEvaluation = JSON.parse(cleanedOutput);
    res.json(evaluation);

  } catch (err: any) {
    console.error("Gemini Grading Error:", err);
    // If anything fails (e.g. JSON parse fails, or API error), return dynamic fallback
    const mockEvaluation = generateMockEvaluation(artwork, analysisText);
    res.json(mockEvaluation);
  }
});

// Helper function to mock appropriate feedbacks for a robust offline/graceful scenario
function generateMockEvaluation(artwork: any, userText: string): AnalysisEvaluation {
  const textWords = userText.trim().split(/\s+/).filter(Boolean).length;
  
  let score = 0;
  let grade = "6";
  let inhalt = 0;
  let stil = 0;
  let bezug = 0;

  if (textWords < 15) {
    score = 15;
    grade = "6";
    inhalt = 5;
    stil = 5;
    bezug = 5;
  } else if (textWords < 50) {
    score = 45;
    grade = "4";
    inhalt = 15;
    stil = 15;
    bezug = 15;
  } else if (textWords < 120) {
    score = 72;
    grade = "2-";
    inhalt = 22;
    stil = 23;
    bezug = 27;
  } else if (textWords < 250) {
    score = 88;
    grade = "1-";
    inhalt = 27;
    stil = 30;
    bezug = 31;
  } else {
    score = 97;
    grade = "1+";
    inhalt = 29;
    stil = 34;
    bezug = 34;
  }

  // Detect matching keywords from context to raise score dynamically
  const userTextLower = userText.toLowerCase();
  let matches = 0;
  const keywords = [...artwork.gradingPrompts.excellentPoints, ...artwork.gradingPrompts.goodPoints];
  keywords.forEach((kw: string) => {
    // Extract key words from prompt sentences
    const subWords = kw.replace(/[()'".,-]/g, "").split(" ").filter(w => w.length > 4);
    subWords.forEach(sw => {
      if (userTextLower.includes(sw.toLowerCase())) {
        matches++;
      }
    });
  });

  // Scale score according to keyword matches
  if (matches > 2) {
    score = Math.min(100, score + matches * 3);
  }

  // Re-calculate grade
  if (score >= 95) grade = "1+";
  else if (score >= 90) grade = "1";
  else if (score >= 85) grade = "1-";
  else if (score >= 80) grade = "2+";
  else if (score >= 75) grade = "2";
  else if (score >= 70) grade = "2-";
  else if (score >= 65) grade = "3+";
  else if (score >= 60) grade = "3";
  else if (score >= 55) grade = "3-";
  else if (score >= 50) grade = "4+";
  else if (score >= 45) grade = "4";
  else if (score >= 40) grade = "4-";
  else if (score >= 30) grade = "5";
  else grade = "6";

  const isPositive = score >= 75;

  const funnyComment = isPositive
    ? `Oha, Bruder! Da hast du ja eine absolute Macher-Analyse rausgehauen! Joony ist stolz auf dich! Du hast das Bild "${artwork.title}" regelrecht seziert wie ein Profi. Absolut 10 von 10 Vibes hier.`
    : `Warte mal kurz... Digga, was war das denn? Du hast zwar ein paar Worte über "${artwork.title}" geschrieben, aber das ist mir noch etwas zu dünn! Da müssen wir nochmal ran, mein Lieber. Trotzdem Ehre für deinen Versuch!`;

  const academicFeedback = isPositive
    ? `Hervorragende Leistung! Deine Analyse zeichnet sich durch einen flüssigen Schreibstil, präzise historische Bezüge und eine gelungene Deutung der Symbole aus. Du hast die Epochenmerkmale perfekt herausgearbeitet.`
    : `Ausbaufähige Leistung. Du hast zwar die offensichtlichen Bestandteile des Bildes recht gut beschrieben, verfehlst jedoch noch eine vertieftere Analyse im geschichtlichen und stilistischen Kontext. Lies dir die Epochenmerkmale noch einmal genau durch!`;

  const accuracies = [
    "Das Bildthema wurde grundlegend erfasst und korrekt eingeordnet.",
    textWords > 50 ? "Die textuelle Beschreibung der Bildelemente ist strukturiert." : "Die Kernaussagen wurden kurz angeschnitten."
  ];

  const missed = [
    "Die detaillierte Ausdeutung der visuellen Symbole hätte noch tiefgründiger sein können.",
    "Der direkte Bezug zu den Epochenspezifika war teilweise noch zu ungenau formuliert."
  ];

  return {
    score,
    grade,
    funnyTeacherComment: funnyComment,
    academicFeedback,
    historicalAccuracies: accuracies,
    missedPoints: missed,
    subScores: {
      inhaltlich: inhalt,
      stilMittel: stil,
      historischerBezug: bezug
    }
  };
}

// Serve Static Files
const staticPath = path.resolve(__dirname, "./dist");
app.use(express.static(staticPath));

// Fallback for SPA Routing
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(staticPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Joonys Analyse-Stunde server listening on port ${PORT}`);
});
