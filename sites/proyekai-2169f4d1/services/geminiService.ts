import { GoogleGenAI } from "@google/genai";
import { ExamParams, EducationLevel } from "../types";

const getSystemInstruction = () => `
Anda adalah AI Asisten Pendidikan Nasional Indonesia. Tugas Anda adalah menyusun kisi-kisi butir soal dan soal evaluasi pembelajaran yang valid, reliabel, dan sesuai dengan prinsip Kurikulum Merdeka.

PRINSIP ADAPTIF JENJANG:
1. SD: Bahasa konkret, sederhana, kontekstual sekitar rumah/sekolah. Opsi PG: A, B, C, D.
2. SMP: Transisi konkret ke abstrak. Opsi PG: A, B, C, D.
3. SMA: Analitis, konseptual, penalaran mendalam. Opsi PG: A, B, C, D, E.
4. SMK: Aplikatif, vokasional, berbasis studi kasus dunia kerja. Opsi PG: A, B, C, D, E.

ATURAN OUTPUT:
Output HARUS dalam format Markdown yang rapi.
Struktur output wajib berurutan dan GUNAKAN JUDUL BAB PERSIS SEPERTI INI:
1. ## IDENTITAS MODUL
2. ## I. KISI-KISI BUTIR SOAL
3. ## II. SOAL EVALUASI
4. ## III. KUNCI JAWABAN

JANGAN sertakan teks pengantar seperti "Berikut adalah..." atau "Semoga membantu...". Langsung ke konten.
`;

export const generateExamContent = async (params: ExamParams): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Constructing a detailed prompt based on user requirements
  let promptContext = `
Buatkan perangkat evaluasi pembelajaran dengan detail sebagai berikut:

INFORMASI UMUM:
- Jenjang: ${params.level}
- Kelas/Fase: ${params.grade}
- Semester: ${params.semester}
- Mata Pelajaran: ${params.subject}
- Materi Pokok: ${params.topic}
- Tujuan Pembelajaran (TP): ${params.learningObjectives}

SPESIFIKASI SOAL:
- Jumlah Soal: ${params.questionCount}
- Bentuk Soal: ${params.questionType}
- Tingkat Kesukaran: ${params.difficulty}
- Distribusi Kognitif: ${params.cognitiveDistribution}
  `;

  if (params.additionalContext) {
    promptContext += `\n- Konteks Tambahan/Stimulus: ${params.additionalContext}`;
  }

  if (params.level === EducationLevel.SMK) {
    promptContext += `\n\nINSTRUKSI KHUSUS SMK:\nSoal harus aplikatif, menggunakan studi kasus dunia kerja, prosedur kerja, atau simulasi masalah teknis sesuai kompetensi keahlian.`;
  }

  promptContext += `\n\nFORMAT OUTPUT (MARKDOWN):
  
  ## IDENTITAS MODUL
  (Tampilkan Nama Sekolah (Placeholder), Mapel, Kelas, dll)

  ## I. KISI-KISI BUTIR SOAL
  Buat tabel dengan kolom: | No | Tujuan Pembelajaran | Materi | Indikator Soal | Level Kognitif | Bentuk Soal | Nomor Soal |

  ## II. SOAL EVALUASI
  (Sajikan soal dengan nomor urut. Jika ada stimulus teks/gambar, deskripsikan stimulus dalam kurung siku [Gambar: ...]).
  
  ## III. KUNCI JAWABAN & PEDOMAN PENSKORAN
  (Sajikan kunci jawaban untuk PG dan Rubrik detail untuk Uraian).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptContext,
      config: {
        systemInstruction: getSystemInstruction(),
        temperature: 0.7, // Balance between creativity for questions and strict format
      }
    });

    return response.text || "Gagal menghasilkan konten. Silakan coba lagi.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Terjadi kesalahan saat menghubungi layanan AI.");
  }
};