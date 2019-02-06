const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/util');

let usuario = new Usuarios();

/**
 * Una vez que alguien se conecta al puerto desde el navegador
 */
io.on('connection', (socket) => {
    
    /**
     * Si envia el entrarChat, verificamos que traiga nombre
     * Si trae nombre lo agregamos a los usuarios
     * Y regresamos la lista de usuarios conectados
     */
    socket.on('entrarChat', (usuarioEntrante, callback) => {
        if( !usuarioEntrante.nombre || !usuarioEntrante.sala) {
            if(callback) {
                return callback({
                    error: true,
                    mensaje: 'Es necesario el nombre y la sala'
                });    
            }
        }

        //Lo asociamos a una sala
        socket.join(usuarioEntrante.sala);
        let usuarios = usuario.setUsuario(socket.id, usuarioEntrante.nombre, usuarioEntrante.sala);
        socket.broadcast.to(usuarioEntrante.sala).emit('listaPersonas', usuario.getUsuariosPorSala(usuarioEntrante.sala));
        socket.broadcast.to(usuarioEntrante.sala).emit('crearMensaje', crearMensaje('Administrador', `Usuario ${usuarioEntrante.nombre} entro`));

        if(callback) callback(usuario.getUsuariosPorSala(usuarioEntrante.sala));
    });

    /**
     * En caso de desconección borramos el usuario del arreglo de usuarios
     * conectados
     */
    socket.on('disconnect', () => {
        let usuarioBorrado = usuario.delUsuario(socket.id);
        if(usuarioBorrado) {
            socket.broadcast.to(usuarioBorrado.sala).emit('crearMensaje', crearMensaje('Administrador', `Usuario ${usuarioBorrado.nombre} salio`));
            socket.broadcast.to(usuarioBorrado.sala).emit('listaPersonas', usuario.getUsuariosPorSala(usuarioBorrado.sala));
        }
    });

    /**
     * Escucha mensaje y transmite a todos
     * socket.emit('crearMensaje',{mensaje:'mensaje a recibir'});
     */
    socket.on('crearMensaje', (data, callback) => {
        let usuarioEnvia = usuario.getUsuario(socket.id);
        let mensaje = crearMensaje( usuarioEnvia.nombre, data.mensaje);
        socket.broadcast.to(usuarioEnvia.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });

    /**
     * Escucha mensaje y transmite a un usuario en especifico
     * socket.emit('',);
     */
    socket.on('mensajePrivado', (data, callback) => {
        if(!data.para) {
            console.log('1');
            if(callback) {
                console.log('2');
                return callback({
                    error: true,
                    mensaje: 'Es necesario enviar el id del usuario'
                });
            }
        }

        if(!data.mensaje) {
            if(callback) {
                return callback({
                    error: true,
                    mensaje: 'Es necesario enviar un mensaje'
                });
            }
        }

        let usuarioEnvia = usuario.getUsuario(socket.id);
        socket.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(usuarioEnvia.nombre, data.mensaje));
    });
});