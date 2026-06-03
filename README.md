# Mapa de PUBG BATTLEGROUNDS

Pagina estatica para compartir mapas de PUBG BATTLEGROUNDS con amigos.

## Contenido

- Fondo oscuro con `Tiza.png`.
- Tarjetas ordenadas por mapa.
- Busqueda por nombre o tipo de ubicacion.
- Filtros para secret rooms, llaves y puntos especiales.
- Visor interactivo para ampliar cada mapa.

## Subir a GitHub

Desde esta carpeta:

```powershell
git init
git branch -M main
git add .
git commit -m "Crear pagina interactiva de mapas PUBG"
git remote add origin https://github.com/Mr-Cntral/Mapa-de-PUBG-BATTLEGROUNDS.git
git push -u origin main
```

Si el repositorio ya tiene archivos y GitHub rechaza el push, primero revisa el contenido remoto antes de forzar nada.

## GitHub Pages

En el repositorio:

1. Entra a Settings.
2. Abre Pages.
3. En Build and deployment selecciona Deploy from a branch.
4. Elige branch `main` y carpeta `/root`.
5. Guarda los cambios.

La pagina quedara en una URL parecida a:

```text
https://mr-cntral.github.io/Mapa-de-PUBG-BATTLEGROUNDS/
```
