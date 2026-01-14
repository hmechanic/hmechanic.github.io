import yaml from 'js-yaml';
import cvRaw from '../assets/cv_es.yaml?raw';

import { CvData } from '../types';

export const cvData = yaml.load(cvRaw) as CvData;
