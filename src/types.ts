// Shape of the CV data loaded from `src/assets/cv_es.yaml`.

export interface SkillCategory {
  name: string;
  data: string;
}

export interface Job {
  position: string;
  organization: string;
  dates: string;
  responsibilities?: string[];
  certificate?: string;
  supervisor?: string;
  department?: string;
  location?: string;
}

/** A named group of entries inside a section (e.g. "Certificaciones"). */
export interface SectionContentGroup<T = unknown> {
  name: string;
  entity: T[];
}

export type ExperienceGroup = SectionContentGroup<Job>;

export interface Section<T = unknown> {
  type: string;
  title?: string;
  bibfile?: string;
  content?: SectionContentGroup<T>[];
}

/** An item under `subheading` — either a contact link or a social profile. */
export interface SubheadingItem {
  name?: string;
  type?: string;
  url?: string;
  highlight?: boolean;
  show_below?: boolean;
}

export interface SubheadingSection {
  type: string;
  content: SubheadingItem[];
}

export interface CvData {
  heading: {
    name: string;
    language?: string;
  };
  subheading: SubheadingSection[];
  professional_profile: {
    title: string;
    content: string;
  };
  sections: Section[];
}
