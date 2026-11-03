import { storageService } from "../services/storageService";

export interface TeacherRecord {
  id: string;
  name: string;
}

export interface CourseRecord {
  id: string;
  name: string;
  guideId: string | null;
}

const TEACHERS_KEY = "don_bosco_teachers_v1";
const COURSES_KEY = "don_bosco_courses_v1";

const initialTeachers = [
  "Pablo Avila Flores", "Ariel Cervantes Nava", "Ignacio Escobar Taida",
  "Ronal Denis Gutierrez Castagne", "Jorge Limber Ledezma", "Jose Luis Jancko Flores",
  "Erick Weimar Palacios Villalta", "Gonzalo Rengifo Sandoval", "Manuel Sanchez Zambrana",
  "Arnaldo Vallejos Perez", "Ibert Freddy Veizaga Moscoso", "Belen Ariana Aguirre Villalba",
  "Fabiola Ines Bueno Claure", "Norian Judith Campos Zambrana", "Mildred Rosario Cardozo Rojas",
  "Nayla Jhissel Colque Zambrana", "Fabiola Sara Duran Arismendi", "Gicela Espindola Molina",
  "Laura Flores Vilar", "Maria Isabel Negrete Espada", "Marianela Saravia Ortega",
  "Patricia Serrano Zambrana", "Maria Jose Velasco Oroza", "Fernanda Catata Valenzuela",
  "Soledad Vedia Duran", "Pastrana Jose Alberto", "Nunez Roxana", "Alvaro Perez",
  "Jose Jancko", "Fabiola Bueno", "Ibert Veizaga", "Gisela Espindola", "Erick Palacios",
  "Norian Campos", "Ariel Cervantes", "Laura Flores", "Jhissel Colque",
  "Ronal Gutierrez", "Roxana Nuñez", "Jose Pastrana",
];

const initialCourseGuides = [
  ["1ro A", "Alvaro Perez"], ["1ro B", "Mildred Cardozo"], ["1ro C", "Pablo Avila"],
  ["2do A", "Jose Jancko"], ["2do B", "Fabiola Bueno"], ["2do C", "Ibert Veizaga"],
  ["3ro A", "Ignacio Escobar"], ["3ro B", "Gisela Espindola"],
  ["4to A", "Erick Palacios"], ["4to B", "Norian Campos"],
  ["5to A", "Ariel Cervantes"], ["5to B", "Laura Flores"], ["5to C", "Jhissel Colque"],
  ["6to A", "Ronal Gutierrez"], ["6to B", "Roxana Nuñez"], ["6to C", "Jose Pastrana"],
];

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function seedTeachers(): TeacherRecord[] {
  return initialTeachers.map((name, index) => ({ id: "teacher-" + (index + 1), name }));
}

function seedCourses(teachers: TeacherRecord[]): CourseRecord[] {
  return initialCourseGuides.map(([name, guideName], index) => ({
    id: "course-" + (index + 1),
    name,
    guideId: teachers.find((teacher) => teacher.name === guideName)?.id ?? null,
  }));
}

function readTeachers(): TeacherRecord[] {
  const saved = storageService.get<TeacherRecord[]>(TEACHERS_KEY);
  if (saved) return saved;
  const seeded = seedTeachers();
  storageService.set(TEACHERS_KEY, seeded);
  return seeded;
}

function readCourses(): CourseRecord[] {
  const saved = storageService.get<CourseRecord[]>(COURSES_KEY);
  if (saved) return saved;
  const seeded = seedCourses(readTeachers());
  storageService.set(COURSES_KEY, seeded);
  return seeded;
}

export function createTeacherUsername(name: string, suffix = "DB2026"): string {
  const parts = normalize(name).split(" ").filter(Boolean);
  const initials = parts.map((part) => part[0]).join("");
  return (initials || "PR").toLocaleUpperCase() + "_" + suffix;
}

export const schoolRepository = {
  getTeachers(): TeacherRecord[] {
    return readTeachers();
  },
  getCourses(): CourseRecord[] {
    return readCourses();
  },
  getGuideName(course: CourseRecord): string {
    return readTeachers().find((teacher) => teacher.id === course.guideId)?.name ?? "Por asignar";
  },
  addTeacher(name: string): TeacherRecord | null {
    const cleanName = normalize(name);
    if (!cleanName || readTeachers().some((teacher) => teacher.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase())) return null;
    const teacher = { id: "teacher-" + Date.now(), name: cleanName };
    storageService.set(TEACHERS_KEY, [...readTeachers(), teacher]);
    return teacher;
  },
  deleteTeacher(id: string): void {
    storageService.set(TEACHERS_KEY, readTeachers().filter((teacher) => teacher.id !== id));
    storageService.set(COURSES_KEY, readCourses().map((course) => course.guideId === id ? { ...course, guideId: null } : course));
  },
  addCourse(name: string): CourseRecord | null {
    const cleanName = normalize(name);
    if (!cleanName || readCourses().some((course) => course.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase())) return null;
    const course = { id: "course-" + Date.now(), name: cleanName, guideId: null };
    storageService.set(COURSES_KEY, [...readCourses(), course]);
    return course;
  },
  deleteCourse(id: string): void {
    const course = readCourses().find((item) => item.id === id);
    storageService.set(COURSES_KEY, readCourses().filter((item) => item.id !== id));
    if (course) {
      const students = storageService.get<Record<string, string[]>>("don_bosco_students_by_course") ?? {};
      const assignments = storageService.get<Record<string, Record<number, string>>>("don_bosco_seat_assignments") ?? {};
      delete students[course.name];
      delete assignments[course.name];
      storageService.set("don_bosco_students_by_course", students);
      storageService.set("don_bosco_seat_assignments", assignments);
    }
  },
  assignGuide(courseId: string, teacherId: string | null): void {
    storageService.set(COURSES_KEY, readCourses().map((course) => course.id === courseId ? { ...course, guideId: teacherId } : course));
  },
  getAdminAccounts(): { id: string; name: string; carnet: string; password: string; role: "ADMIN"; curso: string }[] {
    const teachers = readTeachers();
    return readCourses().flatMap((course) => {
      const teacher = teachers.find((item) => item.id === course.guideId);
      if (!teacher) return [];
      const username = createTeacherUsername(teacher.name);
      return [{ id: "guide-" + teacher.id, name: teacher.name, carnet: username, password: username, role: "ADMIN" as const, curso: course.name }];
    });
  },
  getTeacherUserAccounts(): { id: string; name: string; carnet: string; password: string; role: "USUARIO" }[] {
    const used = new Set<string>();
    return readTeachers().map((teacher) => {
      const base = createTeacherUsername(teacher.name, "USUARIO");
      let username = base;
      let suffix = 2;
      while (used.has(username.toLocaleLowerCase())) {
        username = base.replace("_USUARIO", suffix + "_USUARIO");
        suffix += 1;
      }
      used.add(username.toLocaleLowerCase());
      return { id: "staff-" + teacher.id, name: teacher.name, carnet: username, password: username, role: "USUARIO" as const };
    });
  },
};
