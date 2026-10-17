import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";
import type {
  LoginCredentials,
  User,
  UserRecord,
} from "../types/auth";

const SESSION_KEY = "app_session";
const users = initialUsers as UserRecord[];

const guideAccounts: UserRecord[] = [
  ["Alvaro Perez", "alvaro.perez", "AP1roA26", "1ro A"],
  ["Mildred Cardozo", "mildred.cardozo", "MC1roB26", "1ro B"],
  ["Pablo Avila", "pablo.avila", "PA1roC26", "1ro C"],
  ["Jose Jancko", "jose.jancko", "JJ2doA26", "2do A"],
  ["Fabiola Bueno", "fabiola.bueno", "FB2doB26", "2do B"],
  ["Ibert Veizaga", "ibert.veizaga", "IV2doC26", "2do C"],
  ["Ignacio Escobar", "ignacio.escobar", "IE3roA26", "3ro A"],
  ["Gisela Espindola", "gisela.espindola", "GE3roB26", "3ro B"],
  ["Erick Palacios", "erick.palacios", "EP4toA26", "4to A"],
  ["Norian Campos", "norian.campos", "NC4toB26", "4to B"],
  ["Ariel Cervantes", "ariel.cervantes", "AC5toA26", "5to A"],
  ["Laura Flores", "laura.flores", "LF5toB26", "5to B"],
  ["Jhissel Colque", "jhissel.colque", "JC5toC26", "5to C"],
  ["Ronal Gutierrez", "ronal.gutierrez", "RG6toA26", "6to A"],
  ["Roxana Nuñez", "roxana.nunez", "RN6toB26", "6to B"],
  ["Jose Pastrana", "jose.pastrana", "JP6toC26", "6to C"],
].map(([name, carnet, password, curso], index) => ({
  id: "guia-" + (index + 1), name, carnet, password, role: "ADMIN" as const, curso,
}));

export const authRepository = {
  login(credentials: LoginCredentials): User | null {
    const foundUser = [...guideAccounts, ...users].find(
      (user) =>
        user.carnet === credentials.carnet &&
        user.password === credentials.password &&
        user.role === credentials.role
    );

    if (!foundUser) {
      return null;
    }

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
    return storageService.get<User>(SESSION_KEY);
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};
