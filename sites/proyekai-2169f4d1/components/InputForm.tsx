import React, { useState } from 'react';
import { BookOpen, GraduationCap, LayoutList, Loader2, Sparkles } from 'lucide-react';
import { EducationLevel, ExamParams, QuestionType, DifficultyLevel } from '../types';

interface InputFormProps {
  onSubmit: (data: ExamParams) => void;
  isGenerating: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isGenerating }) => {
  const [formData, setFormData] = useState<ExamParams>({
    level: EducationLevel.SD,
    grade: '',
    semester: 'Ganjil',
    subject: '',
    topic: '',
    learningObjectives: '',
    questionCount: 10,
    questionType: QuestionType.PG,
    difficulty: DifficultyLevel.PROPORSIONAL,
    cognitiveDistribution: 'C1-C2: 30%, C3-C4: 40%, C5-C6: 30%',
    additionalContext: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-primary-600 p-6 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LayoutList className="w-6 h-6" />
          Parameter Penyusunan Soal
        </h2>
        <p className="text-primary-100 text-sm mt-1">
          Lengkapi data berikut untuk menghasilkan kisi-kisi dan soal yang valid.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Section 1: Identitas Jenjang */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Jenjang Pendidikan</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
              >
                {Object.values(EducationLevel).map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Fase / Kelas</label>
            <input
              type="text"
              name="grade"
              placeholder="Contoh: Fase B / Kelas 4"
              required
              value={formData.grade}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Section 2: Mata Pelajaran & Materi */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Mata Pelajaran</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="subject"
                  placeholder="Contoh: IPAS"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Materi Pokok</label>
            <input
              type="text"
              name="topic"
              placeholder="Contoh: Wujud Zat dan Perubahannya"
              required
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tujuan Pembelajaran (TP)</label>
            <textarea
              name="learningObjectives"
              placeholder="Salin Tujuan Pembelajaran di sini..."
              required
              rows={3}
              value={formData.learningObjectives}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
          </div>
        </div>

        {/* Section 3: Spesifikasi Soal */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-100">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Konfigurasi Soal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Bentuk Soal</label>
              <select
                name="questionType"
                value={formData.questionType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                {Object.values(QuestionType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Jumlah Soal</label>
              <input
                type="number"
                name="questionCount"
                min={1}
                max={50}
                value={formData.questionCount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tingkat Kesukaran</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                {Object.values(DifficultyLevel).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Distribusi Kognitif</label>
              <input
                type="text"
                name="cognitiveDistribution"
                value={formData.cognitiveDistribution}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
              <p className="text-xs text-gray-500">Format default: C1-C2 (LOTS), C3-C4 (MOTS), C5-C6 (HOTS)</p>
            </div>
          </div>
        </div>

        {/* Optional Context */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Konteks Tambahan (Opsional)
            <span className="ml-2 text-xs font-normal text-gray-500">Khusus SMK: Masukkan konteks industri/studi kasus.</span>
          </label>
          <textarea
            name="additionalContext"
            rows={2}
            placeholder="Misal: Studi kasus bengkel motor, Prosedur layanan farmasi, dll."
            value={formData.additionalContext}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className={`w-full py-3 px-6 rounded-lg text-white font-semibold shadow-md transition-all flex items-center justify-center gap-2
            ${isGenerating 
              ? 'bg-primary-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transform hover:-translate-y-0.5'
            }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sedang Menyusun Kisi-kisi & Soal...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Sekarang
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;