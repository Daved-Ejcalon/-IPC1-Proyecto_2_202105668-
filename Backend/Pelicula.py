from Comentario import Comentario

class Pelicula:

    def __init__(self, nombre, genero, clasificacion, anio, duracion, link):
        self.nombre = nombre
        self.genero = genero
        self.clasificacion = clasificacion
        self.anio = anio
        self.duracion = duracion
        self.link = link
        self.comentarios = []
    
    #getters
    def getNombre(self):
        return self.nombre
    
    def getGenero(self):
        return self.genero
    
    def getClasificacion(self):
        return self.clasificacion
    
    def getAnio(self):
        return self.anio
    
    def getDuracion(self):
        return self.duracion
    
    def getLink(self):
        return self.link

    def getComentarios(self):
        return self.comentarios
    
    #setters
    def setNombre(self, nombre):
        self.nombre = nombre

    def setGenero(self, genero):
        self.genero = genero
    
    def setClasificacion(self, clasificacion):
        self.clasificacion = clasificacion
    
    def setAnio(self, anio):
        self.anio = anio

    def setDuracion(self, duracion):
        self.duracion = duracion
    
    def setLink(self, link):
        self.link = link
    
    def setComentarios(self, comentarios):
        self.comentarios = comentarios
    
    def agregarComentario(self, usuario, comentario):

        objetoComentario = Comentario(usuario, comentario)
        self.comentarios.append(objetoComentario)
    
    
