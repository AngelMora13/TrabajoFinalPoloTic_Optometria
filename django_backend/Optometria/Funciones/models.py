from django.db import models
from django.db.models.deletion import CASCADE
from Personal.models import Personal

# Create your models here.

CLASIFICACION=(
    ("LENTE","LENTE"),
    ("MONTURA","MONTURA"),
    ("PRODUCTO","PRODUCTO")
)
class Pacientes(models.Model):
    dni=models.IntegerField(unique=True)
    nombre=models.CharField(max_length=20)
    apellido=models.CharField(max_length=20)
    telefono=models.IntegerField(blank=True,null=True)
    fecha=models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.dni}, {self.nombre} {self.apellido}"

class Historias(models.Model):
    paciente=models.ForeignKey(Pacientes,on_delete=CASCADE,blank=False,related_name="pacienteHistoria")
    historialMedico=models.CharField(max_length=400,blank=True)
    fecha=models.DateField(auto_now=True)
    #paciente=ManyToManyField(Pacientes,blank=True,related_name="historia")

    def __str__(self):
        return f"{self.paciente}, {self.fecha}"
    
class Turnos(models.Model):
    paciente=models.ForeignKey(Pacientes,on_delete=CASCADE,blank=False,related_name="pacienteTurnos")
    turno=models.IntegerField(blank=False)
    personalAsignado=models.ForeignKey(Personal,blank=False,related_name="medico",on_delete=CASCADE)
    asistencia=models.BooleanField()
    fecha=models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.turno}, {self.paciente}, {self.personalAsignado}"

class Productos(models.Model):
    nombre=models.CharField(max_length=50)
    clasificacion=models.CharField(choices=CLASIFICACION,max_length=20)
    alcance=models.CharField(blank=True,max_length=20)
    lado=models.CharField(blank=True,max_length=20)
    armazon=models.CharField(blank=True,max_length=20)
    precio=models.FloatField()

    def __str__(self):
        return f"{self.nombre}: {self.precio}"

class Pedidos(models.Model):
    vendedor=models.ForeignKey(Personal,blank=False,related_name="vendedorPedidos",on_delete=CASCADE)
    producto=models.CharField(blank=False,max_length=250)
    paciente=models.ForeignKey(Pacientes,on_delete=CASCADE,blank=False,related_name="pacientePedidos")
    estado=models.CharField(default="Pendiente",blank=False,max_length=10)
    fecha=models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.vendedor}, {self.producto}, estado: {self.estado}"
