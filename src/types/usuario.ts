export interface UsuarioLogin {
  Id_Usuario: number;
  login: string;
  password: string;
  estado: number;
  Id_Trabajador: number;
  Trabajador: string;
  Sucursal: string;
  IdPerfil: number;
}