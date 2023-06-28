try: 
    from flask import Flask
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    from Pelicula import Pelicula
    from Cliente import Cliente
    from Administrador import Administrador
    from Comentario import Comentario

except Exception as e:
    print("Some Modules are Missing {}".format(e))

# Inicio de la aplicacion
app = Flask(__name__)
CORS(app)

# Variables
Clientes = []
Administradores = []
Peliculas = []

# Agregar administrador por defecto
Administradores.append(Administrador('Usuario', 'Administrador', 'admin', 'admin'))

# Manejo de usuarios
@app.route('/login/', methods=['POST']) #metodo para iniciar sesion
def login():
    if request.method == 'POST':
        usuario = request.json['nombreusuario']
        password = request.json['password']

        for administrador in Administradores: #recorre la lista de administradores
            if administrador.getNombreusuario() == usuario:
                if(administrador.getPassword() == password):
                    return jsonify({
                        'message': 'SuccesAdmin',
                        'data': {
                            'tipo': 'administrador',
                            'nombre': administrador.getNombre(),
                            'apellido': administrador.getApellido(),
                            'nombreUsuario': administrador.getNombreusuario(),
                            'password': administrador.getPassword()
                        }
                    })
                else:
                    return jsonify({'message': 'WrongPassword'})
            
        for cliente in Clientes: #recorre la lista de clientes
            if cliente.getNombreusuario() == usuario:
                if(cliente.getPassword() == password):
                    return jsonify({
                        'message': 'SuccesClient',
                        'data': {
                            'tipo': 'cliente',
                            'nombre': cliente.getNombre(),
                            'apellido': cliente.getApellido(),
                            'nombreUsuario': cliente.getNombreusuario(),
                            'password': cliente.getPassword()
                        }
                    })
                else:
                    return jsonify({'message': 'WrongPassword'})
    
    return jsonify({'message': 'Error'})

@app.route('/registro/', methods=['POST']) #metodo para registrar un usuario
def registro():
    if request.method == 'POST':
        nombre = request.json['nombre']
        apellido = request.json['apellido']
        usuario = request.json['usuario']
        password = request.json['password']
        tipo = request.json['tipo']

        if tipo == 'cliente':
            for cliente in Clientes:
                if cliente.getNombreusuario() == usuario:
                    return jsonify({'message': 'ClientExist'})

            # Si no existe el cliente, se crea
            Clientes.append(Cliente(nombre, apellido, usuario, password))
            return jsonify({'message': 'SuccesClient'})
        
        elif tipo == 'administrador':

            for administrador in Administradores:
                if administrador.getNombreusuario() == usuario:
                    return jsonify({'message': 'AdminExist'})
            
            # Si no existe el administrador, se crea
            Administradores.append(Administrador(nombre, apellido, usuario, password))
            return jsonify({'message': 'SuccesAdmin'})
    
    return jsonify({'message': 'Error'})

@app.route('/eliminarUsuario/<string:usuarioEliminar>', methods=['DELETE']) #metodo para eliminar un usuario
def eliminarUsuario(usuarioEliminar):
    if request.method == 'DELETE':

        for administrador in Administradores:
            if administrador.getNombreusuario() == usuarioEliminar:
                Administradores.remove(administrador)
                return jsonify({'message': 'SuccesAdmin'})
            
        for cliente in Clientes:
            if cliente.getNombreusuario() == usuarioEliminar:
                Clientes.remove(cliente)
                return jsonify({'message': 'SuccesClient'})
            
    return jsonify({'message': 'Error'})

@app.route('/recuperarPassword/<string:usuarioRecuperar>', methods=['GET']) #metodo para recuperar la contraseña de un usuario
def recuperarPassword(usuarioRecuperar):
    if request.method == 'GET':

        for administrador in Administradores: #recorre la lista de administradores
            if administrador.getNombreusuario() == usuarioRecuperar:
                return jsonify({
                    'message': 'Succes',
                    'password': administrador.getPassword()
                    })
            
        for cliente in Clientes: #recorre la lista de clientes
            if cliente.getNombreusuario() == usuarioRecuperar:
                return jsonify({
                    'message': 'Succes',
                    'password': cliente.getPassword()
                    })
    
    return jsonify({'message': 'Error'})

@app.route('/modificarUsuario/<string:usuarioModificar>', methods=['POST']) #metodo para modificar un usuario
def modificarUsuario(usuarioModificar):
    if request.method == 'POST':

        usuario = request.json['nombreusuario']
        password = request.json['password']
        nombre = request.json['nombre']
        apellido = request.json['apellido']

        for administrador in Administradores: #recorre la lista de administradores
            if administrador.getNombreusuario() == usuarioModificar:

                administrador.setNombre(nombre)
                administrador.setApellido(apellido)
                administrador.setNombreusuario(usuario)
                administrador.setPassword(password)

                return jsonify({
                    'message': 'Succes',
                    'tipo': 'administrador'
                })
        
       
        for cliente in Clientes: #recorre la lista de clientes
            if cliente.getNombreusuario() == usuarioModificar:

                cliente.setNombre(nombre)
                cliente.setApellido(apellido)
                cliente.setNombreusuario(usuario)
                cliente.setPassword(password)

                return jsonify({
                    'message': 'Succes',
                    'tipo': 'cliente'
                })
    
    return jsonify({'message': 'Error'})

@app.route('/getClientes/', methods=['GET']) #metodo para obtener todos los clientes
def getClientes():
    if request.method == 'GET':
        clientes = []
        for cliente in Clientes:
            clientes.append({
                'nombre': cliente.getNombre(),
                'apellido': cliente.getApellido(),
                'nombreUsuario': cliente.getNombreusuario(),
                'password': cliente.getPassword()
            })
        return jsonify({
            'message': 'Succes',
            'clientes': clientes
        })
    
    return jsonify({'message': 'Error'})

@app.route('/getAdministradores/', methods=['GET']) #metodo para obtener todos los administradores
def getAdministradores():
    if request.method == 'GET':
        administradores = []
        for administrador in Administradores:
            administradores.append({
                'nombre': administrador.getNombre(),
                'apellido': administrador.getApellido(),
                'nombreUsuario': administrador.getNombreusuario(),
                'password': administrador.getPassword()
            })
        return jsonify({
            'message': 'Succes',
            'administradores': administradores
        })
    
    return jsonify({'message': 'Error'})

@app.route('/getUsuario/<string:usuario>', methods=['GET']) #metodo para obtener un usuario
def getUsuario(usuario):
    if request.method == 'GET':
        for administrador in Administradores:
            if administrador.getNombreusuario() == usuario:
                return jsonify({
                    'message': 'Succes',
                    'data': {
                        'tipo': 'administrador',
                        'nombre': administrador.getNombre(),
                        'apellido': administrador.getApellido(),
                        'nombreUsuario': administrador.getNombreusuario(),
                        'password': administrador.getPassword()
                    }
                })
        
        for cliente in Clientes:
            if cliente.getNombreusuario() == usuario:
                return jsonify({
                    'message': 'Succes',
                    'data': {
                        'tipo': 'cliente',
                        'nombre': cliente.getNombre(),
                        'apellido': cliente.getApellido(),
                        'nombreUsuario': cliente.getNombreusuario(),
                        'password': cliente.getPassword()
                    }
                })
    
    return jsonify({'message': 'Error'})

# Manejo de peliculas

@app.route('/addPelicula/', methods=['POST']) #metodo para agregar una pelicula
def addPelicula():
    if request.method == 'POST':
        nombre = request.json['nombre']
        genero = request.json['genero']
        anio = request.json['anio']
        clasificacion = request.json['clasificacion']
        duracion = request.json['duracion']
        link = request.json['linkYouTube']

        if(nombre == '' or genero == '' or anio == '' or clasificacion == '' or duracion == '' or link == ''):
            return jsonify({'message': 'EmptyFields'})

        for pelicula in Peliculas:
            if pelicula.getNombre() == nombre:
                return jsonify({'message': 'PeliculaExist'})

        Peliculas.append(Pelicula(nombre, genero, clasificacion, anio,  duracion, link))
        return jsonify({'message': 'Succes'})
    
    return jsonify({'message': 'Error'})

@app.route('/editPelicula/<string:nombrePelicula>', methods=['POST']) #metodo para editar una pelicula
def editPelicula(nombrePelicula):
    if request.method == 'POST':
        nombre = request.json['nombre']
        genero = request.json['genero']
        anio = request.json['anio']
        clasificacion = request.json['clasificacion']
        duracion = request.json['duracion']
        link = request.json['linkYouTube']

        if(nombre == '' or genero == '' or anio == '' or clasificacion == '' or duracion == '' or link == ''):
            return jsonify({'message': 'EmptyFields'})

        for pelicula in Peliculas:
            if pelicula.getNombre() == nombrePelicula:
                pelicula.setNombre(nombre)
                pelicula.setGenero(genero)
                pelicula.setAnio(anio)
                pelicula.setClasificacion(clasificacion)
                pelicula.setDuracion(duracion)
                pelicula.setLink(link)

                return jsonify({'message': 'Succes'})

        for cliente in Clientes:
            cliente.editarPelicula(nombrePelicula, nombre, genero, anio, clasificacion, duracion, link)
    
    return jsonify({'message': 'Error'})

@app.route('/eliminarPelicula/<string:nombreEliminar>', methods=['DELETE']) #metodo para eliminar una pelicula
def eliminarPelicula(nombreEliminar):
    if request.method == 'DELETE':

        for pelicula in Peliculas:
            if pelicula.getNombre() == nombreEliminar:
                Peliculas.remove(pelicula)

                # Eliminar pelicula de las playlist de los clientes
                for cliente in Clientes:
                    cliente.eliminarPelicula(nombreEliminar)

                return jsonify({'message': 'Succes'})
            
    return jsonify({'message': 'Error'})

@app.route('/addPeliculaToPlaylist/<string:nombreUsuario>', methods=['POST']) #metodo para agregar una pelicula a la playlist de un usuario
def addPeliculaToPlaylist(nombreUsuario):
    if request.method == 'POST':

        nombre = request.json['nombre']

        for pelicula in Peliculas: #recorre la lista de peliculas
            if pelicula.getNombre() == nombre:
                for cliente in Clientes: #recorre la lista de clientes
                    if cliente.getNombreusuario() == nombreUsuario:
                        agregado = cliente.agregarPelicula(pelicula)
                        if(agregado == False):
                            return jsonify({'message': 'PeliculaExist'})
                        else:
                            return jsonify({'message': 'Succes'})
                return jsonify({'message': 'NotClient'})
    
    return jsonify({'message': 'Error'})

@app.route('/getPelicula/<string:nombre>', methods=['GET']) #metodo para eliminar una pelicula
def getPelicula(nombre):
    if request.method == 'GET':
        for pelicula in Peliculas:
            if pelicula.getNombre() == nombre:
                return jsonify({
                    'message': 'Succes',
                    'data': {
                        'nombre': pelicula.getNombre(),
                        'genero': pelicula.getGenero(),
                        'clasificacion': pelicula.getClasificacion(),
                        'anio': pelicula.getAnio(),
                        'duracion': pelicula.getDuracion(),
                        'link': pelicula.getLink(),
                        'comentarios': pelicula.getComentarios()
                    }
                })
    
    return jsonify({'message': 'Error'})


@app.route('/getPeliculas/', methods=['GET']) #metodo para obtener todas las peliculas
def getPeliculas():
    if request.method == 'GET':
        peliculas = []
        for pelicula in Peliculas:
            peliculas.append({
                'nombre': pelicula.getNombre(),
                'genero': pelicula.getGenero(),
                'clasificacion': pelicula.getClasificacion(),
                'anio': pelicula.getAnio(),
                'duracion': pelicula.getDuracion(),
                'link': pelicula.getLink()
            })
        return jsonify({
            'message': 'Succes',
            'peliculas': peliculas
        })
    
    return jsonify({'message': 'Error'})

@app.route('/getPlaylist/<string:nombreUsuario>', methods=['GET']) #metodo para obtener la playlist de un usuario
def getPlaylist(nombreUsuario):
    if request.method == 'GET':
        peliculas = []

        for cliente in Clientes:
            if cliente.getNombreusuario() == nombreUsuario:
                for pelicula in cliente.getPlaylist(): #recorre la lista de peliculas
                    peliculas.append({ #agrega la pelicula a la lista de peliculas
                        'nombre': pelicula.getNombre(),
                        'genero': pelicula.getGenero(),
                        'clasificacion': pelicula.getClasificacion(),
                        'anio': pelicula.getAnio(),
                        'duracion': pelicula.getDuracion(),
                        'link': pelicula.getLink()
                    })
                return jsonify({
                    'message': 'Succes',
                    'peliculas': peliculas
                })
    return jsonify({'message': 'Error'})

@app.route('/getComentarios/<string:nombrePelicula>', methods=['GET']) #metodo para obtener los comentarios de una pelicula
def getComentarios(nombrePelicula):
    if request.method == 'GET':
        comentarios = []

        for pelicula in Peliculas:
            if pelicula.getNombre() == nombrePelicula:
                for comentario in pelicula.getComentarios():
                    comentarios.append({
                        'usuario': comentario.getUsuario(),
                        'comentario': comentario.getComentario()
                    })
                return jsonify({
                    'message': 'Succes',
                    'comentarios': comentarios
                })
    return jsonify({'message': 'Error'})

@app.route('/addComentarioPelicula/', methods=['POST']) #metodo para agregar un comentario a una pelicula
def addComentarioPelicula():
    if request.method == 'POST':
        nombrePelicula = request.json['nombrePelicula'] #nombre de la pelicula
        usuarioComentario = request.json['usuario'] #usuario que hace el comentario
        comentarioUsuario = request.json['comentario'] #comentario del usuario

        for cliente in Clientes: #recorre la lista de clientes
            if cliente.getNombreusuario() == usuarioComentario:
                for pelicula in Peliculas: #recorre la lista de peliculas
                    if pelicula.getNombre() == nombrePelicula:
                        pelicula.agregarComentario(usuarioComentario, comentarioUsuario)
                        return jsonify({'message': 'Succes'})
            
            return jsonify({'message': 'NotClient'})
    
    return jsonify({'message': 'Error'})


# Inicio de la API en modo debug y en el puerto 5000
if __name__ == '__main__':
    app.run(debug=True, port=5000)

