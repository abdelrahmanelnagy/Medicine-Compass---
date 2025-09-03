
export enum Region {
  GLOBAL = "global",
  US = "US",
  EU = "EU",
  UK = "UK",
  SA = "SA",
}

export enum Language {
  EN = "en",
  AR = "ar",
}

export interface Drug {
  id: string;
  region: Region[];
  identifiers: {
    rxCui?: string;
    atc?: string[];
    cas?: string[];
    emaId?: string;
    sfdaRegNo?: string;
  };
  generic_name: string;
  brand_names: string[];
  class: string[];
  mechanism_of_action: string;
  indications: string[];
  dosing_adult: string[];
  dosing_pediatric?: string[];
  contraindications: string[];
  warnings: string[];
  adverse_effects: {
    common: string[];
    serious: string[];
  };
  interactions: {
    severe: string[];
    moderate: string[];
    minor: string[];
    food?: string[];
    alcohol?: string[];
  };
  pregnancy_lactation: string;
  renal_hepatic_adjustment?: string;
  alternatives: {
    generic_equivalents: string[];
    therapeutic_alternatives: { name: string; difference: string }[];
  };
  references: {
    source: string;
    url?: string;
    date_accessed?: string;
  }[];
  quick_warnings: string[];
  boxed_warning?: string;
  availability: 'Rx' | 'OTC';
}
