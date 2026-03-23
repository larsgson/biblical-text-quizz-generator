import type { QuizDefinition } from "../types/api";

/**
 * Maps current feature names to legacy format feature names.
 */
const FEATURE_NAME_MAP: Record<string, string> = {
  part_of_speech: "psp",
  verbal_tense: "tense",
  verbal_stem: "stem",
  lexeme: "lemma",
  gender: "gender",
  number: "number",
  person: "person",
  state: "state",
  gloss: "gloss",
};

/**
 * Maps Text-Fabric search template abbreviations to legacy feature names.
 * e.g. "word sp=verb vt=future" → [{name:"psp", values:["verb"]}, {name:"tense", values:["future"]}]
 */
const TF_ABBREV_MAP: Record<string, string> = {
  sp: "psp",
  vt: "tense",
  vs: "stem",
  gn: "gender",
  nu: "number",
  ps: "person",
  st: "state",
};

function parseSearchTemplate(template: string) {
  const vhand: Array<{
    type: string;
    name: string;
    comparator: string;
    values: string[];
  }> = [];

  // Parse "word sp=verb vt=future" style templates
  const parts = template.trim().split(/\s+/);
  for (const part of parts) {
    const match = part.match(/^(\w+)=(.+)$/);
    if (match) {
      const [, abbrev, value] = match;
      const legacyName = TF_ABBREV_MAP[abbrev];
      if (legacyName) {
        vhand.push({
          type: "enumfeature",
          name: legacyName,
          comparator: "equals",
          values: [value],
        });
      }
    }
  }

  return vhand;
}

function mapCorpusToDatabase(corpus: string): string {
  if (corpus === "greek") return "nestle1904";
  if (corpus === "hebrew") return "BHSA";
  return corpus;
}

export interface LegacyQuizData {
  desc: string;
  database: string;
  properties: string;
  selectedPaths: string[];
  sentenceSelection: {
    object: string;
    mql: null;
    featHand: {
      vhand: Array<{
        type: string;
        name: string;
        comparator: string;
        values: string[];
      }>;
    };
    useForQo: boolean;
  };
  quizObjectSelection: {
    object: string;
    mql: null;
    featHand: { vhand: never[] };
    useForQo: boolean;
  };
  quizFeatures: {
    showFeatures: string[];
    requestFeatures: Array<{
      name: string;
      order_val: string;
      usedropdown: boolean;
    }>;
    dontShowFeatures: string[];
    dontShowObjects: never[];
    glosslimit: number;
  };
  maylocate: boolean;
  sentbefore: string;
  sentafter: string;
  fixedquestions: number;
  randomize: boolean;
}

export function convertToLegacyFormat(quiz: QuizDefinition): LegacyQuizData {
  const db = mapCorpusToDatabase(quiz.corpus);

  const showFeatures: string[] = [];
  const requestFeatures: Array<{
    name: string;
    order_val: string;
    usedropdown: boolean;
  }> = [];
  const dontShowFeatures: string[] = [];

  // Always show "visual" (the word text)
  showFeatures.push("visual");

  let requestOrder = 1;
  for (const f of quiz.features) {
    const legacyName = FEATURE_NAME_MAP[f.name] ?? f.name;
    if (f.visibility === "show") {
      showFeatures.push(legacyName);
    } else if (f.visibility === "request") {
      requestFeatures.push({
        name: legacyName,
        order_val: String(requestOrder++),
        usedropdown: false,
      });
    } else if (f.visibility === "hide") {
      dontShowFeatures.push(legacyName);
    }
  }

  const vhand = parseSearchTemplate(quiz.search_template);

  return {
    desc: quiz.description || "",
    database: db,
    properties: db,
    selectedPaths: [quiz.book],
    sentenceSelection: {
      object: "word",
      mql: null,
      featHand: { vhand },
      useForQo: true,
    },
    quizObjectSelection: {
      object: "word",
      mql: null,
      featHand: { vhand: [] },
      useForQo: false,
    },
    quizFeatures: {
      showFeatures,
      requestFeatures,
      dontShowFeatures,
      dontShowObjects: [],
      glosslimit: 0,
    },
    maylocate: true,
    sentbefore: "0",
    sentafter: "0",
    fixedquestions: quiz.max_questions,
    randomize: quiz.randomize,
  };
}

export function downloadLegacyQuiz(quiz: QuizDefinition) {
  const legacy = convertToLegacyFormat(quiz);
  const json = JSON.stringify(legacy, null, 3);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const filename = quiz.title
    ? `quizdata-${quiz.title.replace(/\s+/g, "-").toLowerCase()}.json`
    : "quizdata.json";
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
