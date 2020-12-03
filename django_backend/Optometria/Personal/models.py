from django.db import models
from django.contrib.auth.models import (BaseUserManager,AbstractBaseUser)


# Create your models here.
class ManejoPersonal(BaseUserManager):
    def create_user(self,dni,password=None):
        if not dni:
            raise ValueError("El DNI no es valido")

        personal=self.model(
            dni=dni,
            )
        personal.set_password(password)
        personal.save(using=self.db)
        return personal
    
    def create_superuser(self,dni,password):
        personal=self.create_user(
            dni=dni,
            password=password,
        )
        personal.staff=True
        personal.admin=True
        personal.save(using=self.db)
        return personal

CARGO=(
    ("SIN CARGO ASIGNADO","SIN CARGO ASIGNADO"),
    ("SECRETARIA","SECRETARIA"),
    ("PROFESIONAL MEDICO","PROFESIONAL MEDICO"),
    ("VENTAS","VENTAS"),
    ("TALLER","TALLER"),
    ("GERENCIA","GERENCIA")
)
class Personal(AbstractBaseUser):

    dni=models.IntegerField(verbose_name="DNI",unique=True)
    nombre=models.CharField(max_length=20)
    apellido=models.CharField(max_length=20)
    telefono=models.IntegerField(blank=True,null=True)
    correo=models.CharField(max_length=50)
    cargo=models.CharField(max_length=20,choices=CARGO)
    active=models.BooleanField(('Activo'),default=True)
    staff=models.BooleanField(default=False)
    admin=models.BooleanField(default=False)

    objects=ManejoPersonal()

    USERNAME_FIELD='dni'
    REQUIRED_FIELDS=[cargo]#dni y contraseña por default

    class Meta:
        verbose_name=('personal')
        verbose_name_plural=('personal')
    #requerido
    def get_full_name(self):
        return self.nombre+" "+self.apellido
    #requerido
    def get_short_name(self):
        return self.nombre
    #requerido
    def has_perm(self,perm,obj=None):
        return True
    #requerido
    def has_module_perms(self,app_label):
        return True
    #requeridos menos el primero q lo puse yo
    @property
    def get_cargo(self):
        return self.cargo
    @property
    def is_active(self):
        return self.active
    @property
    def is_staff(self):
        return self.staff
    @property
    def is_admin(self):
        return self.admin
    #en el caso del dni por ser numero no puedo concatenar, me da error, asi q paso el numeor a string
    def __str__(self):
        return f"{self.dni} {self.nombre} {self.apellido}"

