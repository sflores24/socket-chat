class Usuarios {
    constructor() {
        this.usuarios = [];
    }

    setUsuario(id, nombre, sala) {
        let usuario = {
            id, nombre, sala
        }

        this.usuarios.push(usuario);

        return this.usuarios;
    }

    getUsuario(id) {
        let usuario = this.usuarios.filter( arrUsuario => arrUsuario.id === id)[0];
        return usuario;        
    }

    getUsuarios() {
        return this.usuarios;
    }

    getUsuariosPorSala(sala) {
        let usuariosSala = this.usuarios.filter( arrUsuario => arrUsuario.sala === sala);
        return usuariosSala;
    }

    delUsuario(id) {
        let usuario = this.getUsuario(id);
        this.usuarios = this.usuarios.filter( arrUsuario => arrUsuario.id != id);

        return usuario;
    }


}

module.exports = {
    Usuarios
}