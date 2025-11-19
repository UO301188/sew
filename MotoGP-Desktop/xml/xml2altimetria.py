#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from lxml import etree
from pathlib import Path
import matplotlib.pyplot as plt
from math import radians, sin, cos, sqrt, atan2

class Svg:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.content = []
    def header(self):
        self.content.append('<?xml version="1.0" encoding="UTF-8"?>')
        self.content.append(f'<svg width="{self.w}" height="{self.h}" xmlns="http://www.w3.org/2000/svg">')
    def polyline(self, points, stroke="black", fill="lightgray", w=2):
        pts = " ".join(f"{x},{y}" for x, y in points)
        self.content.append(f'<polyline points="{pts}" stroke="{stroke}" stroke-width="{w}" fill="{fill}" />')
    def footer(self):
        self.content.append('</svg>')
    def save(self, filename):
        Path(filename).write_text("\n".join(self.content), encoding="utf-8")

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000.0
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1)*cos(lat2)*sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

INPUT = Path("circuitoEsquema.xml")
SVG_OUT = Path("altimetria.svg")
PDF_OUT = Path("altimetria.pdf")

tree = etree.parse(str(INPUT))
ns = {"ns": "http://www.uniovi.es"}

lat0 = float(tree.xpath('string(//ns:origen/ns:latitudCoord)', namespaces=ns))
lon0 = float(tree.xpath('string(//ns:origen/ns:longitudCoord)', namespaces=ns))
alt0 = float(tree.xpath('string(//ns:origen/ns:altitudCoord)', namespaces=ns))

puntos = [(lat0, lon0, alt0)]

for pf in tree.xpath('//ns:tramo/ns:puntoFinal', namespaces=ns):
    lat = float(pf.xpath('string(ns:latFinal)', namespaces=ns))
    lon = float(pf.xpath('string(ns:longFinal)', namespaces=ns))
    alt = float(pf.xpath('string(ns:altFinal)', namespaces=ns))
    puntos.append((lat, lon, alt))

dist = [0.0]
for i in range(1, len(puntos)):
    d = haversine(puntos[i-1][0], puntos[i-1][1], puntos[i][0], puntos[i][1])
    dist.append(dist[-1] + d)
altitudes = [p[2] for p in puntos]

W, H, M = 1000, 500, 60
x_min, x_max = 0, dist[-1]
y_min, y_max = min(altitudes), max(altitudes)

def sx(x): return M + (x - x_min)/(x_max - x_min) * (W - 2*M)
def sy(y): return H - M - (y - y_min)/(y_max - y_min) * (H - 2*M)

svg = Svg(W, H)
svg.header()
poly = [(sx(dist[i]), sy(altitudes[i])) for i in range(len(dist))]
svg.polyline(poly + [(sx(x_max), sy(y_min)), (sx(0), sy(y_min))])
svg.footer()
svg.save(SVG_OUT)

fig, ax = plt.subplots(figsize=(10,4))
ax.plot([d/1000 for d in dist], altitudes)
ax.set_xlabel("Distancia (km)")
ax.set_ylabel("Altitud (m)")
ax.set_title("Altimetría del circuito")
ax.grid(True)
fig.tight_layout()
fig.savefig(PDF_OUT)
print("Generados altimetria.svg y altimetria.pdf.")