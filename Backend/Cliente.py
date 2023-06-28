class Cliente:

    def __init__(self, nombre, apellido, nombreusuario, password): #constructor
        self.nombre = nombre
        self.apellido = apellido
        self.nombreusuario = nombreusuario
        self.password = password
        self.playlist = []

    #getters
    def getNombre(self):
        return self.nombre
     
    def getApellido(self):
        return self.apellido
    
    def getNombreusuario(self):
        return self.nombreusuario

    def getPassword(self):
        return self.password
    
    def getPlaylist(self):
        return self.playlist
    
    #setters
    def setNombre(self, nombre):
        self.nombre = nombre
    
    def setApellido(self, apellido):
        self.apellido = apellido
    
    def setNombreusuario(self, nombreusuario):
        self.nombreusuario = nombreusuario
    
    def setPassword(self, password):
        self.password = password
    
    def setPlaylist(self, playlist):
        self.playlist = playlist
    
    def agregarPelicula(self, pelicula):

        if(pelicula in self.playlist): #si la pelicula ya esta en la playlist, no se agrega
            return False
        else:
            self.playlist.append(pelicula)
            return True
    
    def eliminarPelicula(self, peliculaEliminar):
        for pelicula in self.playlist:
            if(pelicula.getNombre() == peliculaEliminar):
                self.playlist.remove(pelicula)
    
    def editarPelicula(self, nombrePelicula, nombre, genero, anio, clasificacion, duracion, link):
        for pelicula in self.playlist:
            if(pelicula.getNombre() == nombrePelicula):
                pelicula.setNombre(nombre)
                pelicula.setGenero(genero)
                pelicula.setAnio(anio)
                pelicula.setClasificacion(clasificacion)
                pelicula.setDuracion(duracion)
                pelicula.setLink(link)
                