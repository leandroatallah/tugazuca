export type DictionaryLanguage = {
  meaning: string;
  usage: string;
};

export type DictionaryEntry = {
  word: string;
  brazil: DictionaryLanguage;
  portugal: DictionaryLanguage;
  notes: string;
};
