#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from lxml import etree
from pathlib import Path

class Kml:
    def __init__(self):
        self.content = []
    def header(self):
        self.content.append('<?xml version="1.0" encoding="UTF-8"?>')
        self.content.append('<kml xmlns="http://www.opengis.net/kml/2.2">')
        self.content.append('<Document>')
    def footer(self):
        self.content.append('</Document>')
        self.content.append('</kml>')
    def placemark(self, coords):
        self.content.append('<Placemark>')
        self.content.append('<name>Recorrido del circuito</name>')
        self.content.append('<Style><LineStyle><width>4</width></LineStyle></Style>')
        self.content.append('<LineString>')
        self.content.append('<altitudeMode>absolute</altitudeMode>')
        self.content.append('<coordinates>')
        for lon, lat, alt in coords:
            self.content.append(f'{lon},{lat},{alt}')
        self.content.append('</coordinates>')
        self.content.append('</LineString>')
        self.content.append('</Placemark>')
    def save(self, filename):
        Path(filename).write_text("\n".join(self.content), encoding="utf-8")

INPUT = Path("circuitoEsquema.xml")
OUTPUT = Path("circuito.kml")

tree = etree.parse(str(INPUT))
ns = {"ns": "http://www.uniovi.es"}

lon0 = float(tree.xpath('string(//ns:origen/ns:longitudCoord)', namespaces=ns))
lat0 = float(tree.xpath('string(//ns:origen/ns:latitudCoord)', namespaces=ns))
alt0 = float(tree.xpath('string(//ns:origen/ns:altitudCoord)', namespaces=ns))

coords = [(lon0, lat0, alt0)]

for pf in tree.xpath('//ns:tramo/ns:puntoFinal', namespaces=ns):
    lon = float(pf.xpath('string(ns:longFinal)', namespaces=ns))
    lat = float(pf.xpath('string(ns:latFinal)', namespaces=ns))
    alt = float(pf.xpath('string(ns:altFinal)', namespaces=ns))
    coords.append((lon, lat, alt))

kml = Kml()
kml.header()
kml.placemark(coords)
kml.footer()
kml.save(OUTPUT)
print(f"Generado {OUTPUT} con {len(coords)} puntos.")