import { JobListing, WorkLifeScore } from "@/lib/types";

const POSITIVE_SIGNALS: Array<{ regex: RegExp; label: string; weight: number }> = [
  { regex: /work[- ]?life balance|balanced workload/, label: "Explicit work-life balance language", weight: 14 },
  { regex: /flexible (hours|schedule)|asynchronous|async-first/, label: "Flexible schedule expectations", weight: 10 },
  { regex: /no overtime|40[- ]?hour|reasonable hours/, label: "Reasonable hours stated", weight: 12 },
  { regex: /remote[- ]?first|fully remote|distributed/, label: "Remote-friendly operating model", weight: 7 },
  { regex: /mental health|wellness|well-being|wellbeing/, label: "Wellness support mentioned", weight: 6 },
  { regex: /focus time|deep work|sustainable pace/, label: "Sustainable pace expectations", weight: 9 }
];

const RISK_SIGNALS: Array<{ regex: RegExp; label: string; penalty: number; severe?: boolean }> = [
  { regex: /fast[- ]?paced|high[- ]?pressure|high intensity/, label: "High-pressure language", penalty: 12 },
  { regex: /hustle|grind|always[- ]?on|go above and beyond/, label: "Always-on expectation", penalty: 16, severe: true },
  { regex: /rockstar|ninja|10x|wear many hats/, label: "Role scope inflation", penalty: 8 },
  { regex: /on[- ]?call|pager duty|weekend support/, label: "Frequent incident/support load", penalty: 14, severe: true },
  { regex: /hypergrowth|move fast|aggressive targets/, label: "Hypergrowth pressure signals", penalty: 9 },
  { regex: /evenings|late nights|crunch/, label: "Overtime expectation", penalty: 15, severe: true }
];

function classify(score: number): WorkLifeScore["classification"] {
  if (score >= 78) {
    return "low-pressure";
  }
  if (score >= 62) {
    return "balanced";
  }
  if (score >= 45) {
    return "mixed";
  }
  return "high-pressure";
}

function clampScore(score: number): number {
  return Math.min(100, Math.max(0, score));
}

export function scoreJobWorkLife(
  input: Pick<JobListing, "title" | "descriptionSnippet" | "company" | "remote">,
  companyBaseline = 60
): WorkLifeScore {
  const corpus = `${input.title} ${input.descriptionSnippet}`.toLowerCase();

  let score = companyBaseline;
  const positiveSignals: string[] = [];
  const riskSignals: string[] = [];
  let severeRiskDetected = false;

  for (const signal of POSITIVE_SIGNALS) {
    if (signal.regex.test(corpus)) {
      score += signal.weight;
      positiveSignals.push(signal.label);
    }
  }

  for (const signal of RISK_SIGNALS) {
    if (signal.regex.test(corpus)) {
      score -= signal.penalty;
      riskSignals.push(signal.label);
      severeRiskDetected = severeRiskDetected || Boolean(signal.severe);
    }
  }

  if (input.remote) {
    score += 4;
    positiveSignals.push("Remote option lowers commute and after-hours friction");
  }

  if (/staff|principal|senior/i.test(input.title)) {
    score += 2;
    positiveSignals.push("Senior role tends to carry more autonomy");
  }

  const normalized = clampScore(score);
  const classification = classify(normalized);
  const shouldExclude = normalized < 45 || (severeRiskDetected && normalized < 58);

  return {
    score: normalized,
    classification,
    positiveSignals,
    riskSignals,
    shouldExclude
  };
}
