from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.db.models.enums import Choices
from .models import Personal

#para la consola
class FormRegistro(forms.ModelForm):

    password=forms.CharField(widget=forms.PasswordInput)
    password2=forms.CharField(label="Confirmar Password",widget=forms.PasswordInput)

    class Meta:
        model=Personal
        fields=("dni","cargo")

    def clean_dni(self):
        dni=self.cleaned_data.get('dni')
        qs=Personal.objects.filter(dni=dni)
        if qs.exists():
            raise forms.ValidationError("dni ya registrado")
        return dni

    def clean_cargo(self):
        cargo=self.cleaned_data.get('cargo')
        return cargo

    def clean_password2(self):
        password=self.cleaned_data.get("password")
        password2=self.cleaned_data.get("password2")
        if password and password2 and password != password2:
            raise forms.ValidationError("Contraseñas no coinciden")
        return password2

#lo de abajo todo es para el admin de django

class AdminFormCrearPersonal(forms.ModelForm):
    password=forms.CharField(widget=forms.PasswordInput)
    password2=forms.CharField(label="Confirmar Password",widget=forms.PasswordInput)

    class Meta:
        model=Personal
        fields=("dni","nombre","apellido","telefono","correo","cargo")
    
    def clean_password2(self):
        password=self.cleaned_data.get("password")
        password2=self.cleaned_data.get("password2")
        if password and password2 and password != password2:
            raise forms.ValidationError("Contraseñas no coinciden")
        return password2

    def save(self,commit=True):
        usuario=super(AdminFormCrearPersonal,self).save(commit=False)
        usuario.set_password(self.cleaned_data["password"])
        if commit:
            usuario.save()

        return usuario
    
class AdminFormActualizar(forms.ModelForm):
    password=ReadOnlyPasswordHashField()

    class Meta:
        model=Personal
        fields=("dni","nombre","apellido","telefono","correo","cargo","active","admin")

    def clean_password(self):
        return self.initial["password"]