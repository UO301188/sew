#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from lxml import etree
from pathlib import Path

class Html:
    def __init__(self):
        self.content = []
    def header(self):
        self.content.append('<!DOCTYPE html>')
        self.content.append('<html lang="es">')
        self.content.append('<head>')
        self.content.append('<meta charset="UTF-8">')
        self.content.append('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
        self.content.append('<title>Información del Circuito</title>')
        self.content.append('<link rel="stylesheet" type="text/css" href="estilo/estilo.css"  />')
        self.content.append('</head><body>')
    def footer(self):
        self.content.append('</body></html>')
    def section(self, title, items):
        self.content.append(f'<section><h2>{title}</h2>')
        for item in items:
            self.content.append(f'<p>{item}</p>')
        self.content.append('</section>')
    def save(self, filename):
        Path(filename).write_text("\n".join(self.content), encoding="utf-8")

INPUT = Path("circuitoEsquema.xml")
OUTPUT = Path("InfoCircuito.html")

tree = etree.parse(str(INPUT))
ns = {"ns": "http://www.uniovi.es"}

nombre = tree.xpath('string(//ns:nombre)', namespaces=ns)
longitud = tree.xpath('string(//ns:longitud)', namespaces=ns)
anchura = tree.xpath('string(//ns:anchura)', namespaces=ns)
fecha = tree.xpath('string(//ns:fecha)', namespaces=ns)
hora = tree.xpath('string(//ns:hora)', namespaces=ns)
localidad = tree.xpath('string(//ns:localidad)', namespaces=ns)
pais = tree.xpath('string(//ns:pais)', namespaces=ns)
patrocinador = tree.xpath('string(//ns:patrocinador)', namespaces=ns)

referencias = []
for ref in tree.xpath('//ns:referencia', namespaces=ns):
    titulo = ref.xpath('string(ns:titulo)', namespaces=ns)
    url = ref.get('url')
    referencias.append(f'{url}{titulo}</a>')

clasificacion = []
for puesto in tree.xpath('//ns:clasificacion/ns:puesto', namespaces=ns):
    pos = puesto.get('pos')
    piloto = puesto.xpath('string(ns:piloto)', namespaces=ns)
    puntos = puesto.xpath('string(ns:puntos)', namespaces=ns)
    clasificacion.append(f'{pos}. {piloto} - {puntos} puntos')

html = Html()
html.header()
html.section('Datos del Circuito', [f'Nombre: {nombre}', f'Longitud: {longitud} m', f'Anchura: {anchura} m', f'Fecha: {fecha}', f'Hora: {hora}', f'Localidad: {localidad}', f'País: {pais}', f'Patrocinador: {patrocinador}'])
html.section('Referencias', referencias)
html.section('Clasificación', clasificacion)
html.footer()
html.save(OUTPUT)
print(f"Generado {OUTPUT}.")