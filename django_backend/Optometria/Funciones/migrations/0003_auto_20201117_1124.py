# Generated by Django 3.1.2 on 2020-11-17 15:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Funciones', '0002_auto_20201117_1123'),
    ]

    operations = [
        migrations.AlterField(
            model_name='turnos',
            name='turno',
            field=models.IntegerField(),
        ),
    ]
