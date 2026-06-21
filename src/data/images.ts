import { Artwork } from "../types";

export const artworks: Artwork[] = [
  {
    id: "wanderer",
    title: "Der Wanderer über dem Nebelmeer",
    artist: "Caspar David Friedrich",
    year: "1818",
    subject: "Deutsch",
    subSubject: "Epoche der Romantik",
    description: "Das absolute Schlüsselbild der deutschen Romantik. Ein einsamer Mann blickt von einem rauen Felsvorsprung auf eine im Nebel versunkene Gebirgslandschaft. Es symbolisiert die emotionale Tiefe, die Erhabenheit der Natur und das zerrissene Subjekt der damaligen Epoche.",
    taskDescription: "Analysiere das Gemälde unter Berücksichtigung der Epochenmerkmale der Romantik. Achte besonders auf Komposition (Bildaufbau), Farbstimmung, Naturdarstellung und das Verhältnis von Mensch und Natur (Sehnsucht vs. Erhabenheit).",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg",
    historicalContext: `
      Epoche: Romantik (ca. 1795–1835).
      Zentrale Themen: Sehnsucht, Unendlichkeit, Naturerhabenheit, Subjektivität, Gefühle über Verstand (Gegenbewegung zur rationalen Aufklärung und Industrialisierung).
      Wichtige Analyseelemente:
      - Ruckenfigur (Rückenansicht des Mannes): Ermöglicht dem Betrachter, sich hineinzuprojizieren. Der Wanderer steht im Zentrum, blockiert aber die direkte Sicht auf den Fluchtpunkt.
      - Zweigeteilter Bildaufbau: Der feste, dunkle Vordergrund (Fels) steht im scharfen Kontrast zum verschwommenen, hellen Hintergrund (Nebelmeer, weite Berge).
      - Natur als Seelenspiegel: Die wilde, neblige Landschaft spiegelt die emotionale Innenwelt (Melancholie, Sehnsucht, Zweifel, Abgrund) des Wanderers wider.
      - Farblichkeit: Düstere Braunschwarz-Töne im Vordergrund, ätherisches Blau, Grau und Weiß im Hintergrund.
      - Überhöhung/Sakralisierung der Natur: Natur wird zu einem spirituellen Tempel, fast religiöses Erleben statt rein wissenschaftlichem Vermessen.
    `,
    gradingPrompts: {
      excellentPoints: [
        "Begriff 'Rückenfigur' genannt",
        "Kontrast zwischen dauerhaftem Fels (Heimat) und flüchtigem Nebelmeer (Sehnsucht/Zukunft)",
        "Gegenbewegung zur Aufklärung / Industrialisierung erwähnt",
        "Natur als Spiegel der Seele / Innenwelt gedeutet",
        "Religiöse/spirituelle Dimension der Naturwahrnehmung (Sakralisierung)"
      ],
      goodPoints: [
        "Einordnung in die Epoche der Romantik",
        "Bildbeschreibung (Mann im Rock, Gehstock, Felsen, Nebel)",
        "Sehnsucht oder Fernweh erwähnt",
        "Bedeutung der Farben (dunkler Fels vs. lichte Weite) genannt"
      ]
    }
  },
  {
    id: "scream",
    title: "Der Schrei",
    artist: "Edvard Munch",
    year: "1893",
    subject: "Deutsch",
    subSubject: "Epoche des Expressionismus",
    description: "Eines der wegweisendsten Werke des fin de siècle. Edvard Munch schuf mit diesem Bild das ultimative Symbol moderner Existenzangst und psychischer Zerrissenheit. Es bricht radikal mit dem realistischen Abbild und drückt die reine subjektive Erfahrung aus.",
    taskDescription: "Analysiere das Gemälde unter literarisch-stilistischen Gesichtspunkten des (Früh-)Expressionismus. Welche Gefühle drückt die Figur aus und mit welchen visuellen/stilistischen Mitteln (Farbwahl, Formgebung, Linienführung) wird diese Wirkung im Werk erzeugt?",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/The_Scream.jpg",
    historicalContext: `
      Epoche: Früher Expressionismus / Symbolismus (ca. 1890–1920).
      Zentrale Themen: Entfremdung, Isolation, Großstadt-Apokalypse, Verlust tradierter Werte, Angst des modernen Individuums, ungelebte Sehnsucht, radikale Verzerrung der äußeren Realität, um die innere Wahrheit zu zeigen.
      Wichtige Analyseelemente:
      - Figur im Vordergrund: Ein geschlechtsloses, mumienartiges Wesen presst die Hände an die Ohren, der Mund ist zu einem endlosen Schrei geöffnet.
      - Schreiende Natur: Die wellenförmigen Himmel- und Landschaftslinien scheinen den Schrei wie Schallwellen fortzusetzen. 'Ich fühlte einen großen, unendlichen Schrei durch die Natur gehen' (Munchs Tagebuch).
      - Komposition: Extrem diagonales Geländer bricht die geschwungenen Kurven der Landschaft und schafft ein Gefühl des Kontrollverlusts und des Sturzes.
      - Kontrastierende Personen: Zwei dunkle Silhouetten im Hintergrund gehen unberührt weiter - Symbol für die existenzielle Isolation des Schreitenden.
      - Farbpalette: Unnatürliche, schreiende Komplementärfarben (blutrotes Orange des Himmels, trübes Blaugelb der Bucht).
    `,
    gradingPrompts: {
      excellentPoints: [
        "Zuordnung zum Expressionismus oder Symbolismus",
        "Munchs Intention genannt ('Schrei durch die Natur' / Manifestation innerer Zustände)",
        "Dissonante Farbwahl (blutrot, giftgelb, düsterblau) als psychologische Farben gedeutet",
        "Diagonale des Brückengeländers als trennendes, stürzendes Element analysiert",
        "Zwei Personen im Hintergrund als Sinnbild für existenzielle Einsamkeit / Isolation gedeutet"
      ],
      goodPoints: [
        "Beschreibung des schreitenden Wesens (Hände an Ohren, offener Mund)",
        "Themen wie Angst, Verzweiflung, Panik oder Depression genannt",
        "Expressionistische Verzerrung der Realität wahrgenommen",
        "Kontrast zwischen Himmel (rot) und Wasser (blau) erwähnt"
      ]
    }
  },
  {
    id: "bastille",
    title: "Die Freiheit führt das Volk (La Liberté guidant le peuple)",
    artist: "Eugène Delacroix",
    year: "1830",
    subject: "Geschichte",
    subSubject: "Julirevolution 1830 / Französische Revolution",
    description: "Ein monumentales Gemälde der französischen Romantik und Revolution. Es veranschaulicht den heroischen Kampf des Volkes für Bürgerrechte und Freiheit gegen die restituierte Bourbonen-Monarchie.",
    taskDescription: "Analysiere dieses weltberühmte Werk. Erkläre die Symbolik der zentralen weiblichen Figur (Marianne/Libertas) und untersuche, welche Bevölkerungsklassen in den Mitstreitern dargestellt sind. Setze das Bild zur französischen Revolution in Bezug.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Eug%C3%A8ne_Delacroix_-_La_libert%C3%A9_guidant_le_peuple.jpg",
    historicalContext: `
      Kontext: Französische Julirevolution von 1830. Der reaktionäre Bourbonen-König Karl X. wird durch den Aufstand der Bürger in Paris gestürzt. Einsetzung des 'Bürgerkönigs' Louis-Philippe.
      Wichtige Analyseelemente:
      - Zentrale Figur: Marianne als Personifikation der Freiheit (Barbusige Libertas). Sie trägt die rote phrygische Mütze (Symbol der befreiten Sklaven der Antike), blickt zurück zum Volk, um es vorwärtszutreiben, und hält die französische Trikolore (Blau-Weiß-Rot) hoch. In der anderen Hand trägt sie ein Bajonettgewehr.
      - Klassenübergreifendes Bündnis:
        - Links: Ein eleganter Mann mit Zylinder (Bürgertum/Bourgeoisie), oft als Delacroix' Selbstbildnis interpretiert, hält eine Flinte.
        - Rechts davon: Ein einfacher Arbeiter mit Säbel (Proletariat, Sansculotten-Tradition).
        - Rechts von Marianne: Ein kleiner Junge mit Pistolen (Straßenjunge von Paris/Gavroche-Figur - Jugend, revolutionärer Eifer).
      - Die Gefallenen im Vordergrund: Soldaten der königlichen Garde liegen tot im Schmutz am Fuß der Barrikade und verdeutlichen den hohen Preis der Freiheit.
      - Im Hintergrund: Die Silhouette von Paris mit der Kathedrale Notre-Dame, auf deren Turm bereits die Trikolore weht.
    `,
    gradingPrompts: {
      excellentPoints: [
        "Bezug zur Julirevolution von 1830 hergestellt (Sturz Karl X.)",
        "Weibliche Figur als Personifikation 'Marianne' oder 'Libertas' gedeutet",
        "Bedeutung der Triumphelemente: Trikolore und Phrygische Mütze (Jakobinerbezug / Antike Sklavenfreiheit) erklärt",
        "Klassenübergreifendes Motiv analysiert (Arbeiter mit Säbel, Bürger mit Zylinder, Straßenjunge mit Pistole)",
        "Kontrast/Drama durch tote Soldaten im Schlamm (Märtyrer/Gegner) analysiert"
      ],
      goodPoints: [
        "Freiheit als Anführerin des Volkes benannt",
        "Trikolore (französische Flagge) erwähnt",
        "Barrikaden und Rauch in Paris beschrieben",
        "Thema Revolution, Volkserhebung oder Barrikadenkampf erfasst"
      ]
    }
  },
  {
    id: "bismarck_werner",
    title: "Bismarcks Entlassung (Der Abschied)",
    artist: "Anton von Werner",
    year: "1892",
    subject: "Geschichte",
    subSubject: "Kaiserreich (Ende der Ära Bismarck)",
    description: "Dieses Historiengemälde von Anton von Werner zeigt den Moment im Jahr 1890, als Otto von Bismarck nach seinem Rücktritt das Reichskanzlerpalais verlässt. Es ist eine offizielle, fast heroisierende Darstellung des Abschieds.",
    taskDescription: "Analysiere dieses Historiengemälde. Wie wird Bismarck im Vergleich zu den umstehenden Personen dargestellt? Welche Bildsprache nutzt Anton von Werner, um die historische Bedeutung dieses Augenblicks zu unterstreichen?",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Bildarchiv_Preu%C3%9Fischer_Kulturbesitz.jpg",
    historicalContext: `
      Kontext: März 1890. Bismarck, der 'Reichsgründer', tritt nach 19 Jahren als Reichskanzler zurück. Sein Nachfolger Leo von Caprivi steht bereits bereit.
      Wichtige Analyseelemente:
      - Bismarck im Zentrum: Trotz seiner Entlassung wirkt er aufrecht, würdevoll und fast überlebensgroß in seiner schwarzen Kürassieruniform.
      - Staffage: Die umstehenden Offiziere und Beamten bilden eine respektvolle Gasse. Der Moment wird als nationales Ereignis von hoher Würde inszeniert.
      - Farbwahl: Dominanz von Schwarz und Preußisch-Blau, was die Ernsthaftigkeit und Staatstreue betont.
      - Kontrast zur Karikatur: Während Tenniel (Punch) den 'Lotsen' eher tragisch oder resigniert zeigt, inszeniert Werner ihn als unersetzliches Nationaldenkmal.
    `,
    gradingPrompts: {
      excellentPoints: [
        "Bismarck als zentrale Identifikationsfigur des Preußen-Kults identifiziert",
        "Kontrast zwischen offizieller Historiomalerei und Karikatur herausgearbeitet",
        "Uniformierung und militärische Haltung als Symbole für das preußische Staatsverständnis gedeutet",
        "Erwähnung der emotionalen Zurückhaltung ('preußische Distanz') im Bild"
      ],
      goodPoints: [
        "Abschied Bismarcks im Jahr 1890 richtig eingeordnet",
        "Beschreibung der Uniformen und der Personengruppe",
        "Erkennung der Würde und Ernsthaftigkeit der Szene"
      ]
    }
  },
  {
    id: "bismarck_foto",
    title: "Bismarck verlässt das Reichskanzlerpalais (Foto)",
    artist: "Unbekannter Photograph",
    year: "1890",
    subject: "Geschichte",
    subSubject: "Kaiserreich (Historische Dokumente)",
    description: "Eine der seltenen authentischen Photographien von Bismarcks letztem öffentlichen Auftreten in Berlin. Es dokumentiert die reale Verabschiedung des ersten Reichskanzlers durch die Bevölkerung und das Militär.",
    taskDescription: "Untersuche diese historische Photographie als Quelle. Welchen Eindruck vermittelt das Bild im Vergleich zum Gemälde von Anton von Werner? Achte auf die Menschenmengen und die Stimmung, die durch die Bildkomposition eingefangen wird.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/25/1890_Bismarcks_Ruecktritt.jpg",
    historicalContext: `
      Kontext: Die reale Verabschiedung Bismarcks war von großer öffentlicher Anteilnahme geprägt. Viele Deutsche sahen in ihm die Garanten für Stabilität und waren über die Entlassung durch den jungen Wilhelm II. besorgt.
      Analyseaspekte:
      - Authentizität: Als Foto beansprucht dieses Dokument eine höhere 'Wahrheit' als das inszenierte Gemälde.
      - Dynamik: Man sieht die Bewegung der Kutsche und die dichte Menschenmenge. Es ist kein statischer Moment, sondern ein Ereignis 'am Boden'.
      - Die Sicht der Zeitgenossen: Das Bild belegt, dass Bismarck trotz seiner Entlassung eine enorme Popularität im Volk genoss.
    `,
    gradingPrompts: {
      excellentPoints: [
        "Unterscheidung zwischen Quelle (Foto) und Darstellung (Gemälde) getroffen",
        "Bedeutung der öffentlichen Anteilnahme als Beweis für Bismarcks Status als 'Übervater' erkannt",
        "Analyse der Bildperspektive (Augenzeugen-Perspektive)"
      ],
      goodPoints: [
        "Beschreibung der Kutsche und der wartenden Menge",
        "Ereignis des Rücktritts 1890 korrekt zugeordnet",
        "Unterschied zwischen inszenierter Kunst und dokumentarischem Foto genannt"
      ]
    }
  }
];

export function getArtworkById(id: string): Artwork | undefined {
  return artworks.find((a) => a.id === id);
}
