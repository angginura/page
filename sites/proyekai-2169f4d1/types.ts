export enum EducationLevel {
  SD = 'SD',
  SMP = 'SMP',
  SMA = 'SMA',
  SMK = 'SMK'
}

export enum QuestionType {
  PG = 'Pilihan Ganda',
  URAIAN = 'Uraian',
  CAMPURAN = 'Campuran (PG + Uraian)'
}

export enum DifficultyLevel {
  MUDAH = 'Mudah',
  SEDANG = 'Sedang',
  SULIT = 'Sulit',
  PROPORSIONAL = 'Proporsional (30:40:30)'
}

export interface ExamParams {
  level: EducationLevel;
  grade: string;
  semester: string;
  subject: string;
  topic: string;
  learningObjectives: string;
  questionCount: number;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  cognitiveDistribution: string; // e.g., "C1-C2: 30%, C3-C4: 40%, C5-C6: 30%"
  additionalContext?: string; // For SMK context or stimuli
}

export interface GenerationResult {
  content: string; // Markdown content
}