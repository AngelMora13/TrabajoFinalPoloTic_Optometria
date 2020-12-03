from django.urls import path
from . import views

app_name="api"
urlpatterns = [
    path("turnos/",views.turnosAdd,name="turnos"),
    path("pacientes/",views.pacientesAdd,name="pacientes"),
    path("historias/",views.historiasAdd,name="historias"),
    path("pedidos/",views.pedidosAdd,name="pedidos"),
    path("login/",views.singup,name="singup"),
    path("productos/",views.productosVista,name="productos"),
    path("personal/",views.personal,name="personal")
]
