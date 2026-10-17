"""GeoJSON for a site, from the one thing a legacy export usually has: a point.

The standard's boundary needs site (a GeoJSON feature) and area. Camden's open data gives a
latitude and longitude for the centre of the application, not the red line. So the site here is a
small square around that point, which is enough to put the application on a map and to satisfy the
schema, and it is not the real boundary. A council that holds real boundaries should pass them in
instead (boundary= on post_submission.build).

The square is SIDE metres across. Coordinates are [longitude, latitude], as GeoJSON requires.
"""

from __future__ import annotations

import math

#: Width of the stand in square, in metres.
SIDE = 10.0
_METRES_PER_DEGREE = 111_320.0


def point_feature(latitude: float, longitude: float) -> dict:
    return {"type": "Feature", "properties": None,
            "geometry": {"type": "Point", "coordinates": [longitude, latitude]}}


def site_boundary(latitude: float, longitude: float, side: float = SIDE) -> dict:
    """{site, area} for a square of the given side centred on the point."""
    half_lat = (side / 2) / _METRES_PER_DEGREE
    half_lng = (side / 2) / (_METRES_PER_DEGREE * math.cos(math.radians(latitude)))
    west, east = round(longitude - half_lng, 7), round(longitude + half_lng, 7)
    south, north = round(latitude - half_lat, 7), round(latitude + half_lat, 7)
    ring = [[west, south], [east, south], [east, north], [west, north], [west, south]]
    square_metres = round(side * side, 2)
    return {
        "site": {
            "type": "Feature",
            "properties": None,
            "geometry": {"type": "Polygon", "coordinates": [ring]},
            "bbox": [west, south, east, north],
        },
        "area": {"squareMetres": square_metres, "hectares": round(square_metres / 10_000, 6)},
    }
