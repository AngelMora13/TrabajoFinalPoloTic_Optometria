
from django.conf import settings
from django.contrib.auth.models import update_last_login
from django.http.response import JsonResponse
from django.contrib.auth import authenticate, get_user_model

import jwt
from rest_framework import exceptions

from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework_jwt.settings import api_settings

from .serializer import historiaSerializer,pacienteSerializer, personalSerializer, productosSerializer,turnosSerializer,pedidosSerializer
from .models import Pacientes,Historias,Turnos,Pedidos,Productos
from Personal.models import Personal

# Create your views here.

def authenticar(request):
    user=get_user_model()
    header=request.headers.get("authorization")
    if not header:
        return None
    try:
        token=header
        payload=jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed("Token ha expirado")
    except IndexError:
        raise exceptions.AuthenticationFailed("no hay Token")
    user=user.objects.get(id=payload["user_id"])
    if user is None:
        raise exceptions.AuthenticationFailed("el usuario no esta registrado")
    return (user)

@api_view(["GET","POST"])
def turnosAdd(request):
    user=authenticar(request)
    if user is None:
        return JsonResponse({"mensaje":"usted no tiene permisos para acceder a estos datos"})
    else:
        if request.method=="GET":
            turnos=Turnos.objects.all()        
            if user.cargo=="SECRETARIA" or user.cargo=="GERENCIA":
                turno_serializer=turnosSerializer(turnos,many=True)
                return JsonResponse(turno_serializer.data,safe=False)

            elif user.cargo=="PROFESIONAL MEDICO":
                turnos=turnos.filter(personalAsignado=user.id)
                turno_serializer=turnosSerializer(turnos,many=True)
                return JsonResponse(turno_serializer.data,safe=False)

        elif request.method=="POST":
            if user.cargo=="SECRETARIA":
                turnoNuevo=JSONParser().parse(request)
                try:
                    turno=Turnos.objects.get(id=turnoNuevo["id"])
                    turno_serializer=turnosSerializer(turno,data=turnoNuevo)
                    if turno_serializer.is_valid():
                        turno_serializer.save()
                        return JsonResponse(turno_serializer.data)
                except KeyError:
                    turno_serializer=turnosSerializer(data=turnoNuevo)
                    if turno_serializer.is_valid():
                        turno_serializer.save()
                        return JsonResponse(turno_serializer.data)

                return JsonResponse({"mensaje":"Los datos no son validos"},status=status.HTTP_400_BAD_REQUEST)
    return JsonResponse({"mensaje":"usted no tiene permisos para acceder a estos datos"})

@api_view(["GET","POST"])
def pacientesAdd(request):
    user=authenticar(request)
    if user is None:
        return JsonResponse({"mensaje":"usted no tiene permisos para acceder a estos datos"})
    else:
        if request.method=="GET":
            paciente=Pacientes.objects.all()        
            if user.cargo=="SECRETARIA" or user.cargo=="PROFESIONAL MEDICO" or user.cargo=="VENTAS" or user.cargo=="TALLER" or user.cargo=="GERENCIA":
                paciente_serializer=pacienteSerializer(paciente,many=True)
                return JsonResponse(paciente_serializer.data,safe=False)

        elif request.method=="POST":
            if user.cargo=="SECRETARIA":                
                pacienteNuevo=JSONParser().parse(request)
                try: 
                    paciente=Pacientes.objects.get(dni=pacienteNuevo["dni"])                     
                    paciente_serializer=pacienteSerializer(paciente,data=pacienteNuevo)
                    if paciente_serializer.is_valid():
                        paciente_serializer.save()
                        return JsonResponse(paciente_serializer.data)
                except Pacientes.DoesNotExist:
                    paciente_serializer=pacienteSerializer(data=pacienteNuevo)
                    if paciente_serializer.is_valid():
                        paciente_serializer.save()
                        return JsonResponse(paciente_serializer.data)
    return JsonResponse({"mensaje":"usted no tiene permisos para acceder a estos datos"})

@api_view(["GET","POST"])
def historiasAdd(request):
    user=authenticar(request)
    if user is None:
        return JsonResponse({"mensaje":"usted no tiene permisos para acceder a estos datos"})
    else:
        if request.method=="GET":
            if user.cargo=="PROFESIONAL MEDICO":
                historia=Historias.objects.all()
                turnos=Turnos.objects.all()     
                turnos=turnos.filter(personalAsignado=user.id)
                turnos=turnos.values_list("paciente",flat=True).distinct()

                historia=historia.filter(paciente__in=turnos)
                historia_serializer=historiaSerializer(historia,many=True)
                return JsonResponse(historia_serializer.data,safe=False)
            elif user.cargo=="GERENCIA":
                historia=Historias.objects.all()
                historia_serializer=historiaSerializer(historia,many=True)
                return JsonResponse(historia_serializer.data,safe=False)
        elif request.method=="POST":
            if user.cargo=="PROFESIONAL MEDICO":
                historia=JSONParser().parse(request)
                historia_serializer=historiaSerializer(data=historia)
                if historia_serializer.is_valid():
                    historia_serializer.save()
                    return JsonResponse(historia_serializer.data)
                return JsonResponse({"mensaje":"los datos no son validos"})

    return JsonResponse({"mensaje":"usted no tiene permisos para acceder a estos datos"})

@api_view(["GET","POST"])
def pedidosAdd(request):
    user=authenticar(request)
    if user is None:
        return JsonResponse({"mensaje":"usted no tiene permisos para acceder a estos datos"})
    else:
        if request.method=="GET":
            if user.cargo=="VENTAS":
                pedidos=Pedidos.objects.filter(vendedor=user.id).filter(estado="Pendiente")
                pedidos_serializer=pedidosSerializer(pedidos,many=True)
                return JsonResponse(pedidos_serializer.data,safe=False)

            elif user.cargo=="TALLER":
                pedidos=Pedidos.objects.filter(estado="Taller")
                pedidos_serializer=pedidosSerializer(pedidos,many=True)
                return JsonResponse(pedidos_serializer.data,safe=False)
            
            elif user.cargo=="GERENCIA":
                pedidos=Pedidos.objects.all()
                pedidos_serializer=pedidosSerializer(pedidos,many=True)
                return JsonResponse(pedidos_serializer.data,safe=False)

        elif request.method=="POST":
            if user.cargo=="VENTAS":
                pedidoNuevo=JSONParser().parse(request)
                print(pedidoNuevo)
                try:
                    pedido=Pedidos.objects.all().filter(vendedor=user.id).filter(estado="Pendiente").get(id=pedidoNuevo["id"])
                    print(pedido)
                    pedido_serializer=pedidosSerializer(pedido,data=pedidoNuevo)
                    if pedido_serializer.is_valid():
                        pedido_serializer.save()
                        return JsonResponse(pedido_serializer.data)
                except KeyError:
                    pedido_serializer=pedidosSerializer(data=pedidoNuevo)
                    if pedido_serializer.is_valid():
                        pedido_serializer.save()
                        return JsonResponse(pedido_serializer.data)
                return JsonResponse({"mensaje":"Los datos no son validos"},status=status.HTTP_400_BAD_REQUEST)
            
            elif user.cargo=="TALLER":
                actualizarPedido=JSONParser().parse(request)
                try:
                    pedido=Pedidos.objects.filter(estado="Taller").get(id=actualizarPedido["id"])
                    pedido_serializer=pedidosSerializer(pedido,data=actualizarPedido)
                    if pedido_serializer.is_valid():
                        pedido_serializer.save()
                        return JsonResponse(pedido_serializer.data)
                except Pedidos.DoesNotExist:
                    return JsonResponse({"mensaje":"No tiene permisos para modificar el pedido"},status=status.HTTP_400_BAD_REQUEST)

    return JsonResponse({"mensaje":"Los datos no son validos"},status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def productosVista(request):
    user=authenticar(request)
    if user is None:
        return JsonResponse({"mensaje":"usted no tiene permisos para acceder a estos datos"})
    else:
        if request.method=="GET":
            if user.cargo=="VENTAS" or user.cargo=="TALLER" or user.cargo=="GERENCIA":
                productos=Productos.objects.all()
                productos_serializer=productosSerializer(productos,many=True)
                return JsonResponse(productos_serializer.data,safe=False)
                
    return JsonResponse({"mensaje":"usted no tiene permisos para acceder a estos datos"})

jwt_payload_handler=api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler=api_settings.JWT_ENCODE_HANDLER
@api_view(["POST"])
def singup(request):
    if request.method=="POST":
        log=JSONParser().parse(request)
        try:
            username=log["username"]
            password=log["password"]
        except KeyError:
            raise exceptions.AuthenticationFailed("Debe ingresar un DNI y Contraseña validos")
        user=authenticate(username=username,password=password)
        if user is not None:
            try:
                payload=jwt_payload_handler(user)
                token=jwt_encode_handler(payload)
                user_details ={}
                user_details["id"]=user.id
                user_details["dni"]=user.dni
                user_details["nombre"]=user.nombre
                user_details["apellido"]=user.apellido
                user_details["cargo"]=user.cargo
                user_details["token"]=token
                update_last_login(None,user)
                return JsonResponse(user_details,status=status.HTTP_200_OK)
            
            except Exception as e:
                raise exceptions.AuthenticationFailed("Error en Backend")
        else:
            raise exceptions.AuthenticationFailed("DNI o Contraseña invalidos")

    return JsonResponse({"mensaje":"login no exitoso"})        

def autenticado(request):
    if request.user.is_authenticated:
        return True
    else:
        return False
        
def personal(request):
    user=authenticar(request)
    if user is None:
        return JsonResponse({"mensaje":"usted no tiene permisos para acceder a estos datos"})
    else:
        if request.method=="GET":    
            if user.cargo=="SECRETARIA":
                personal=Personal.objects.filter(cargo="PROFESIONAL MEDICO")
                personal_serializer=personalSerializer(personal,many=True)
                return JsonResponse(personal_serializer.data,safe=False)

            elif user.cargo=="GERENCIA":
                personal=Personal.objects.all()
                personal_serializer=personalSerializer(personal,many=True)
                return JsonResponse(personal_serializer.data,safe=False)
                
    return JsonResponse({"mensaje":"usted no tiene permisos para acceder a estos datos"})