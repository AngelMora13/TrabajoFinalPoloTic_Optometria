from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .forms import AdminFormActualizar,AdminFormCrearPersonal
from .models import Personal

# Register your models here.

class UserAdmin(BaseUserAdmin):

    form=AdminFormActualizar
    add_form=AdminFormCrearPersonal

    list_display=("dni","admin","nombre")
    list_filter=("admin",)
    fieldsets=(
        (None,{"fields":("dni","password")}),
        ("Informacion Personal",{"fields":("nombre","apellido","correo","telefono")}),
        ("permisos Django",{"fields":("admin","staff","active","cargo")}),
    )

    add_fieldsets=(
        (None,{
            "classes":("wide",),
            "fields":("dni","password","password2","cargo")}),
    )
    search_fields=("dni",)
    ordering=("dni",)
    filter_horizontal=()

admin.site.register(Personal,UserAdmin)