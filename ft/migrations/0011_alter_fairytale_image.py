# Generated by Django 5.0.4 on 2024-04-12 06:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ft', '0010_alter_fairytale_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fairytale',
            name='image',
            field=models.ImageField(upload_to='fairytales/'),
        ),
    ]