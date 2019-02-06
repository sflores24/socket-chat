var params = new URLSearchParams(window.location.search);
var socket = io();

var nombre = params.get('nombre');
var sala = params.get('sala');

//Ref jquery
divUsuario = $('#divUsuarios');
formEnviar = $('#formEnviar');
txtMensaje = $('#txtMensaje');
divChatBox = $('#divChatbox');

function renderUser(usuarios) {
    console.log(usuarios);
    var html = '';

    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> '+ params.get('sala') +'</span></a>';
    html += '</li>';

    for(var cont=0; cont < usuarios.length; cont++) {
        html += '<li>';
        html += '<a data-id="'+usuarios[cont].id
                +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'
                + usuarios[cont].nombre +' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuario.html(html);
}

function renderMessages(mensaje, isMe) {
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    var adminClass = 'info';

    if( mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if( isMe ) {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '    <h5>'+ mensaje.nombre +'</h5>';
        html += '    <div class="box bg-light-inverse">'+ mensaje.mensaje +'</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">'+ hora +'</div>';
        html += '</li>';    
    } else {
        html += '<li class="animated fadeIn">';
        if( mensaje.nombre != 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += '    <h5>'+ mensaje.nombre +'</h5>';
        html += '    <div class="box bg-light-'+adminClass+'">'+ mensaje.mensaje +'</div>';
        html += '</div>';
        html += '<div class="chat-time">'+ hora +'</div>';
        html += '</li>';    
    }

    divChatBox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatBox.children('li:last-child');

    // heights
    var clientHeight = divChatBox.prop('clientHeight');
    var scrollTop = divChatBox.prop('scrollTop');
    var scrollHeight = divChatBox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatBox.scrollTop(scrollHeight);
    }
}

//Listeners
divUsuario.on('click', 'a', function(){
    var id = $(this).data('id');

    if(id) {
        console.log(id);
    }
});

formEnviar.on('submit', function(evento) {
    event.preventDefault();
    if(txtMensaje.val().trim() === 0) {
        return;
    }

    socket.emit('crearMensaje', {
     nombre: nombre,
     mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus();
        renderMessages(mensaje, true);
        scrollBottom();
    });
});