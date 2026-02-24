export type GenerationJob = {
  presetId: string;
  languageCode: string;
};

export function buildGenerationPlan(presetIds: string[], languageCodes: string[]): GenerationJob[] {
  const cleanPresets = presetIds.filter((value, index) => value && presetIds.indexOf(value) === index);
  const cleanLanguages = languageCodes.filter((value, index) => value && languageCodes.indexOf(value) === index);

  const jobs: GenerationJob[] = [];

  for (const presetId of cleanPresets) {
    for (const languageCode of cleanLanguages) {
      jobs.push({ presetId, languageCode });
    }
  }

  return jobs;
}
