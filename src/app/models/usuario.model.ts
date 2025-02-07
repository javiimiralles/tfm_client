export class Usuario {
  constructor(
    public id?: number,
    public email?: string,
    public password?: string,
    public rol?: string,
    public permisos?: string[]
  ) {
  }
}
