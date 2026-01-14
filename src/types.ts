/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SectionContent {
    name: string;
    entity: any;
    [key: string]: any; // Allow other properties like url, type (for socials)
}

export interface Section {
    type: string;
    content: SectionContent[];
}

export interface SkillCategory {
    name: string;
    data: string;
}

export interface Job {
    position: string;
    organization: string;
    dates: string;
    responsibilities: string[];
}

export interface Social {
    type: string;
    url: string;
}

export interface CvData {
    sections: Section[];
    subheading: Section[];
    professional_profile: {
        title: string;
        content: string;
    };
    heading: {
        name: string;
    };
    [key: string]: any;
}
