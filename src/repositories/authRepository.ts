import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";
import { schoolRepository } from "./schoolRepository";
import type { LoginCredentials, User, UserRecord } from "../types/auth";

const SESSION_KEY = "app_session";

const superAdminAccount: UserRecord = {
  id: "super-admin-director",
  name: "Director Académico",
  carnet: "director",
  password: "DonBosco2026",
  role: "SUPER_ADMIN",
};
const users = initialUsers as UserRecord[];

export const authRepository = {
  login(credentials: LoginCredentials): User | null {
    const dynamicAccounts = [
      ...schoolRepository.getAdminAccounts(),
      ...schoolRepository.getTeacherUserAccounts(),
    ] as UserRecord[];
    const foundUser = [superAdminAccount, ...dynamicAccounts, ...users].find(
      (user) => user.carnet.toLocaleLowerCase() === credentials.carnet.trim().toLocaleLowerCase()
        && user.password === credentials.password
        && user.role === credentials.role
    );
    if (!foundUser) return null;
    const sessionUser: User = {
      id: foundUser.id,
      name: foundUser.name,
      carnet: foundUser.carnet,
      role: foundUser.role,
      ...(foundUser.curso ? { curso: foundUser.curso } : {}),
    };
    storageService.set<User>(SESSION_KEY, sessionUser);
    return sessionUser;
  },
  logout(): void {
    storageService.remove(SESSION_KEY);
  },
  getCurrentUser(): User | null {
    const session = storageService.get<User>(SESSION_KEY);
    if (session?.role === "ADMIN") {
      const stillAssigned = schoolRepository.getAdminAccounts().some(
        (account) => account.carnet === session.carnet && account.curso === session.curso
      );
      if (!stillAssigned) {
        storageService.remove(SESSION_KEY);
        return null;
      }
    }
    if (session?.role === "USUARIO") {
      const stillInStaff = schoolRepository.getTeacherUserAccounts().some(
        (account) => account.carnet === session.carnet
      );
      if (!stillInStaff) {
        storageService.remove(SESSION_KEY);
        return null;
      }
    }
    return session;
  },
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};
