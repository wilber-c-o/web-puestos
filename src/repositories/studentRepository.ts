import { storageService } from "../services/storageService";

const STUDENTS_KEY = "don_bosco_students_by_course";
const ASSIGNMENTS_KEY = "don_bosco_seat_assignments";
type StudentsByCourse = Record<string, string[]>;
type SeatAssignments = Record<string, Record<number, string>>;

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
  removeFromCourse(course: string, studentName: string): void {
    const assignments = storageService.get<SeatAssignments>(ASSIGNMENTS_KEY) ?? {};
    const courseSeats = { ...(assignments[course] ?? {}) };
    Object.keys(courseSeats).forEach((seat) => {
      if (courseSeats[Number(seat)] === studentName) delete courseSeats[Number(seat)];
    });
    storageService.set(ASSIGNMENTS_KEY, { ...assignments, [course]: courseSeats });
  },
  renameInCourse(course: string, oldName: string, newName: string): void {
    const assignments = storageService.get<SeatAssignments>(ASSIGNMENTS_KEY) ?? {};
    const courseSeats = { ...(assignments[course] ?? {}) };
    Object.keys(courseSeats).forEach((seat) => {
      if (courseSeats[Number(seat)] === oldName) courseSeats[Number(seat)] = newName;
    });
    storageService.set(ASSIGNMENTS_KEY, { ...assignments, [course]: courseSeats });
  },
};
