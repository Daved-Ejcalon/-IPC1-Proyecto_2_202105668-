class Administrador:

    def __init__(self, nombre, apellido, nombreusuario, password): #constructor
        self.nombre = nombre
        self.apellido = apellido
        self.nombreusuario = nombreusuario
        self.password = password

    #getters
    def getNombre(self):
        return self.nombre
     
    def getApellido(self):
        return self.apellido
    
    def getNombreusuario(self):
        return self.nombreusuario

    def getPassword(self):
        return self.password
    
    #setters
    def setNombre(self, nombre):
        self.nombre = nombre
    
    def setApellido(self, apellido):
        self.apellido = apellido
    
    def setNombreusuario(self, nombreusuario):
        self.nombreusuario = nombreusuario
    
    def setPassword(self, password):
        self.password = password