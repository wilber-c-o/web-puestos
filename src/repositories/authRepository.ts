import initialUsers from "../data/users.json";
import { storageService } from "../services/storageService";
import type {
  LoginCredentials,
  User,
  UserRecord,
} from "../types/auth";

const SESSION_KEY = "app_session";
const users = initialUsers as UserRecord[];

// Cuentas independientes para los 28 integrantes del plantel docente.
// Todas son cuentas USUARIO; no modifican ni reemplazan cuentas ADMIN existentes.
const teacherAccounts: UserRecord[] = [
  ["Pablo Avila Flores", "pablo.avila.flores", "donboscoPAF"],
  ["Ariel Cervantes Nava", "ariel.cervantes.nava", "donboscoACN"],
  ["Ignacio Escobar Taida", "ignacio.escobar.taida", "donboscoIET"],
  ["Ronal Denis Gutierrez Castagne", "ronal.denis.gutierrez.castagne", "donboscoRDGC"],
  ["Jorge Limber Ledezma", "jorge.limber.ledezma", "donboscoJLL"],
  ["Jose Luis Jancko Flores", "jose.luis.jancko.flores", "donboscoJLJF"],
  ["Erick Weimar Palacios Villalta", "erick.weimar.palacios.villalta", "donboscoEWPV"],
  ["Gonzalo Rengifo Sandoval", "gonzalo.rengifo.sandoval", "donboscoGRS"],
  ["Manuel Sanchez Zambrana", "manuel.sanchez.zambrana", "donboscoMSZ"],
  ["Arnaldo Vallejos Perez", "arnaldo.vallejos.perez", "donboscoAVP"],
  ["Ibert Freddy Veizaga Moscoso", "ibert.freddy.veizaga.moscoso", "donboscoIFVM"],
  ["Belen Ariana Aguirre Villalba", "belen.ariana.aguirre.villalba", "donboscoBAAV"],
  ["Fabiola Ines Bueno Claure", "fabiola.ines.bueno.claure", "donboscoFIBC"],
  ["Norian Judith Campos Zambrana", "norian.judith.campos.zambrana", "donboscoNJCZ"],
  ["Mildred Rosario Cardozo Rojas", "mildred.rosario.cardozo.rojas", "donboscoMRCR"],
  ["Nayla Jhissel Colque Zambrana", "nayla.jhissel.colque.zambrana", "donboscoNJCZ"],
  ["Fabiola Sara Duran Arismendi", "fabiola.sara.duran.arismendi", "donboscoFSDA"],
  ["Gicela Espindola Molina", "gicela.espindola.molina", "donboscoGEM"],
  ["Laura Flores Vilar", "laura.flores.vilar", "donboscoLFV"],
  ["Maria Isabel Negrete Espada", "maria.isabel.negrete.espada", "donboscoMINE"],
  ["Marianela Saravia Ortega", "marianela.saravia.ortega", "donboscoMSO"],
  ["Patricia Serrano Zambrana", "patricia.serrano.zambrana", "donboscoPSZ"],
  ["Maria Jose Velasco Oroza", "maria.jose.velasco.oroza", "donboscoMJVO"],
  ["Fernanda Catata Valenzuela", "fernanda.catata.valenzuela", "donboscoFCV"],
  ["Soledad Vedia Duran", "soledad.vedia.duran", "donboscoSVD"],
  ["Pastrana Jose Alberto", "pastrana.jose.alberto", "donboscoPJA"],
  ["Nunez Roxana", "nunez.roxana", "donboscoNR"],
  ["Alvaro Perez", "alvaro.perez", "donboscoAP"],
].map(([name, carnet, password], index) => ({
  id: "docente-" + (index + 1),
  name,
  carnet,
  password,
  role: "USUARIO" as const,
}));

export const authRepository = {
  login(credentials: LoginCredentials): User | null {
    const foundUser = [...teacherAccounts, ...users].find(
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
