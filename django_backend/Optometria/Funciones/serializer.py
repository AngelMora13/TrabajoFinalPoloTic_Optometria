from Personal.models import Personal
from rest_framework import serializers
from .models import Pacientes,Historias,Pedidos, Productos,Turnos

class pacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model=Pacientes
        fields=("id","dni","nombre","apellido","telefono","fecha")

class historiaSerializer(serializers.ModelSerializer):
    class Meta:
        model=Historias
        fields=("id","paciente","historialMedico","fecha")

class pedidosSerializer(serializers.ModelSerializer):
    class Meta:
        model=Pedidos
        fields=("id","vendedor","producto","paciente","estado","fecha")

class turnosSerializer(serializers.ModelSerializer):
    class Meta:
        model=Turnos
        fields=("id","paciente","turno","personalAsignado","asistencia","fecha")

class productosSerializer(serializers.ModelSerializer):
    class Meta:
        model=Productos
        fields=("id","nombre","clasificacion","alcance","lado","armazon","precio")

class personalSerializer(serializers.ModelSerializer):
    class Meta:
        model=Personal
        fields=("id","dni","nombre","apellido","cargo")