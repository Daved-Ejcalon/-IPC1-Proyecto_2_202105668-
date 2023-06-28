class Comentario:

    def __init__(self, usuario, comentario):
        self.usuario = usuario
        self.comentario = comentario
    
    #getters
    def getUsuario(self):
        return self.usuario
    
    def getComentario(self):
        return self.comentario
    
    #setters
    def setUsuario(self, usuario):
        self.usuario = usuario

    def setComentario(self, comentario):
        self.comentario = comentario
    