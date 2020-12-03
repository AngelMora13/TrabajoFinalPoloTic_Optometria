from django.contrib import admin
from .models import Pacientes,Historias,Pedidos,Productos,Turnos
# Register your models here.
admin.site.register(Pacientes)
admin.site.register(Historias)
admin.site.register(Pedidos)
admin.site.register(Productos)
admin.site.register(Turnos)