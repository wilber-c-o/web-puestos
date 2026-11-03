import { storageService } from "../services/storageService";

const STUDENTS_KEY = "don_bosco_students_by_course";
type StudentsByCourse = Record<string, string[]>;

function readAll(): StudentsByCourse {
  return storageService.get<StudentsByCourse>(STUDENTS_KEY) ?? {};
}

export const studentRepository = {
  getByCourse(course: string): string[] {
    return readAll()[course] ?? [];
  },
  saveForCourse(course: string, students: string[]): void {
    const all = readAll();
    storageService.set(STUDENTS_KEY, { ...all, [course]: students });
  },
};
