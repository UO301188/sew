#!/usr/bin/env python3
import xml.etree.ElementTree as ET

class Html:
    def __init__(self):
        self.content = []

    def add(self, text):
        self.content.append(text)

    def header(self, title):
        self.add('<!DOCTYPE html>')
        self.add('<html lang="es">')
        self.add('<head>')
        self.add('<meta charset="UTF-8">')
        self.add('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
        self.add(f'<title>{title}</title>')
        self.add('estilo.css')
        self.add('</head>')
        self.add('<body>')

    def footer(self):
        self.add('</body>')
        self.add('</html>')

    def h1(self, text):
        self.add(f'<h1>{text}</h1>')

    def p(self, text):
        self.add(f'<p>{text}</p>')

    def ul_start(self):
        self.add('<ul>')

    def ul_end(self):
        self.add('</ul>')

    def li(self, text):
        self.add(f'<li>{text}</li>')

    def img(self, src, alt):
        self.add(f'{src}')

    def video(self, src, alt):
        self.add(f'<video controls style="max-width:100%;height:auto;">')
        self.add(f'{src}')
        self.add(f'{alt}')
        self.add('</video>')

    def save(self, filename):
        with open(filename, 'w', encoding='utf-8') as f:
            f.write('\n'.join(self.content))

# Parsear circuitoEsquema.xml
ns = {'ns': 'http://www.uniovi.es'}
tree = ET.parse('circuitoEsquema.xml')
root = tree.getroot()

# Extraer datos generales usando XPath
nombre = root.findtext('.//ns:nombre', namespaces=ns)
longitud = root.findtext('.//ns:longitud', namespaces=ns)
anchura = root.findtext('.//ns:anchura', namespaces=ns)
fecha = root.findtext('.//ns:fecha', namespaces=ns)
hora = root.findtext('.//ns:hora', namespaces=ns)
numVueltas = root.findtext('.//ns:numVueltas', namespaces=ns)
localidad = root.findtext('.//ns:localidad', namespaces=ns)
pais = root.findtext('.//ns:pais', namespaces=ns)
patrocinador = root.findtext('.//ns:patrocinador', namespaces=ns)

# Referencias
referencias = []
for ref in root.findall('.//ns:referencias/ns:referencia', namespaces=ns):
    url = ref.get('url')
    titulo = ref.findtext('ns:titulo', namespaces=ns)
    autor = ref.findtext('ns:autor', namespaces=ns)
    anio = ref.findtext('ns:año', namespaces=ns)
    referencias.append((titulo, autor, anio, url))

# Galería fotos
fotos = []
for foto in root.findall('.//ns:galeriaFotos/ns:foto', namespaces=ns):
    src = foto.get('src')
    alt = foto.get('alt')
    fotos.append((src, alt))

# Galería videos
videos = []
for video in root.findall('.//ns:galeriaVideos/ns:video', namespaces=ns):
    src = video.get('src')
    alt = video.get('alt')
    videos.append((src, alt))

# Vencedor y clasificación
vencedor = root.findtext('.//ns:vencedor/ns:nombreVencedor', namespaces=ns)
duracion = root.findtext('.//ns:vencedor/ns:duracion', namespaces=ns)
clasificacion = []
for puesto in root.findall('.//ns:clasificacion/ns:puesto', namespaces=ns):
    pos = puesto.get('pos')
    piloto = puesto.findtext('ns:piloto', namespaces=ns)
    puntos = puesto.findtext('ns:puntos', namespaces=ns)
    clasificacion.append((pos, piloto, puntos))

# Generar HTML
html = Html()
html.header('Información del Circuito')
html.h1(nombre)
html.p(f"Longitud: {longitud} m | Anchura: {anchura} m")
html.p(f"Fecha: {fecha} | Hora: {hora}")
html.p(f"Número de vueltas: {numVueltas}")
html.p(f"Localidad: {localidad}, País: {pais}")
html.p(f"Patrocinador: {patrocinador}")

html.h1('Referencias')
html.ul_start()
for titulo, autor, anio, url in referencias:
    html.li(f'{url}{titulo}</a> ({autor}, {anio})')
html.ul_end()

html.h1('Galería de Fotos')
for src, alt in fotos:
    html.img(src, alt)

html.h1('Galería de Videos')
for src, alt in videos:
    html.video(src, alt)

html.h1('Vencedor')
html.p(f"{vencedor} - Duración: {duracion}")

html.h1('Clasificación')
html.ul_start()
for pos, piloto, puntos in clasificacion:
    html.li(f"Posición {pos}: {piloto} ({puntos} puntos)")
html.ul_end()

html.footer()
html.save('InfoCircuito.html')

print("Archivo InfoCircuito.html generado correctamente.")