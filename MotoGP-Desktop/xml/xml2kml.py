#!/usr/bin/env python3
"""xml2kml.py
Lee "circuitoEsquema.xml" (con espacio de nombres) y genera "circuito.kml".
Usa expresiones XPath (con xml.etree.ElementTree) para obtener coordenadas.
"""

import xml.etree.ElementTree as ET
from pathlib import Path

INPUT = Path("circuitoEsquema.xml")
OUTPUT = Path("circuito.kml")

def main():
    if not INPUT.exists():
        print(f"ERROR: {INPUT} no encontrado en el directorio actual.")
        return
    tree = ET.parse(INPUT)
    root = tree.getroot()
    ns = 'http://www.uniovi.es'
    nsmap = {'ns': ns}

    origen_long = root.findtext('.//ns:origen/ns:longitudCoord', namespaces=nsmap)
    origen_lat  = root.findtext('.//ns:origen/ns:latitudCoord', namespaces=nsmap)
    origen_alt  = root.findtext('.//ns:origen/ns:altitudCoord', namespaces=nsmap)

    coords = []
    if origen_long and origen_lat:
        coords.append((float(origen_long), float(origen_lat), float(origen_alt) if origen_alt else 0.0))

    tramos = root.findall('.//ns:tramo', namespaces=nsmap)
    for tramo in tramos:
        longf = tramo.findtext('.//ns:puntoFinal/ns:longFinal', namespaces=nsmap)
        latf  = tramo.findtext('.//ns:puntoFinal/ns:latFinal', namespaces=nsmap)
        altf  = tramo.findtext('.//ns:puntoFinal/ns:altFinal', namespaces=nsmap)
        if longf and latf:
            coords.append((float(longf), float(latf), float(altf) if altf else 0.0))

    kml_header = '<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n    <name>circuito.kml</name>\n    <description>Planimetría generada desde circuitoEsquema.xml</description>\n'
    placemark = ('    <Placemark>\n'
                 '        <name>Recorrido del circuito</name>\n'
                 '        <Style>\n'
                 '            <LineStyle>\n'
                 '                <width>4</width>\n'
                 '            </LineStyle>\n'
                 '        </Style>\n'
                 '        <LineString>\n'
                 '            <altitudeMode>absolute</altitudeMode>\n'
                 '            <coordinates>\n')
    coords_text = ''
    for lon, lat, alt in coords:
        coords_text += f'                {lon},{lat},{alt}\n'
    placemark_close = '            </coordinates>\n        </LineString>\n    </Placemark>\n'
    kml_footer = '</Document>\n</kml>\n'
    kml = kml_header + placemark + coords_text + placemark_close + kml_footer

    OUTPUT.write_text(kml, encoding='utf-8')
    print(f'Generado {OUTPUT} con {len(coords)} coordenadas.')

if __name__ == '__main__':
    main()