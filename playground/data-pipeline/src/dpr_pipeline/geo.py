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


# --- a real boundary, where the source holds one -------------------------------------------------

_EARTH_RADIUS = 6_371_000.0


def _positions(ring) -> list[tuple[float, float]] | None:
    """A ring as (longitude, latitude) pairs, closed, or None if it is not usable."""
    if not isinstance(ring, list):
        return None
    points = []
    for position in ring:
        if (not isinstance(position, (list, tuple)) or len(position) < 2
                or not all(isinstance(n, (int, float)) and not isinstance(n, bool)
                           and math.isfinite(n) for n in position[:2])):
            return None
        lng, lat = float(position[0]), float(position[1])
        if not (-180 <= lng <= 180 and -90 <= lat <= 90):
            return None
        points.append((lng, lat))
    if points and points[0] != points[-1]:
        points.append(points[0])
    return points if len(points) >= 4 else None


def _polygons(geometry) -> list[list[list[tuple[float, float]]]] | None:
    """Every polygon in a Polygon or MultiPolygon as a list of rings (outer first), or None."""
    if not isinstance(geometry, dict):
        return None
    kind, coordinates = geometry.get("type"), geometry.get("coordinates")
    if kind == "Polygon":
        coordinates = [coordinates]
    elif kind != "MultiPolygon":
        return None
    if not isinstance(coordinates, list) or not coordinates:
        return None
    polygons = []
    for polygon in coordinates:
        if not isinstance(polygon, list) or not polygon:
            return None
        rings = [_positions(ring) for ring in polygon]
        if any(ring is None for ring in rings):
            return None
        polygons.append(rings)
    return polygons


def _flat_area(ring: list[tuple[float, float]], lat0: float) -> float:
    """Square metres of one ring, projected flat around lat0. Fine at the size of a site."""
    kx = _METRES_PER_DEGREE * math.cos(math.radians(lat0))
    ky = _METRES_PER_DEGREE
    total = 0.0
    for (x1, y1), (x2, y2) in zip(ring, ring[1:]):
        total += (x1 * kx) * (y2 * ky) - (x2 * kx) * (y1 * ky)
    return abs(total) / 2


def area_square_metres(geometry: dict) -> float | None:
    polygons = _polygons(geometry)
    if polygons is None:
        return None
    lats = [lat for rings in polygons for ring in rings for _, lat in ring]
    lat0 = (min(lats) + max(lats)) / 2
    total = 0.0
    for rings in polygons:
        total += _flat_area(rings[0], lat0) - sum(_flat_area(hole, lat0) for hole in rings[1:])
    return total


def boundary_from_geometry(geometry) -> dict | None:
    """{site, area} for a Polygon or MultiPolygon the source holds, or None if it is unusable.

    Unusable means not a polygon, a ring with fewer than four positions, a position that is not a
    pair of finite numbers in range, or no area. An open ring is closed rather than refused.
    """
    polygons = _polygons(geometry)
    if polygons is None:
        return None
    square_metres = area_square_metres(geometry)
    if not square_metres or square_metres <= 0:
        return None
    closed = [[[ [lng, lat] for lng, lat in ring] for ring in rings] for rings in polygons]
    shape = ({"type": "Polygon", "coordinates": closed[0]} if geometry["type"] == "Polygon"
             else {"type": "MultiPolygon", "coordinates": closed})
    xs = [lng for rings in polygons for ring in rings for lng, _ in ring]
    ys = [lat for rings in polygons for ring in rings for _, lat in ring]
    square_metres = round(square_metres, 2)
    return {
        "site": {"type": "Feature", "properties": None, "geometry": shape,
                 "bbox": [min(xs), min(ys), max(xs), max(ys)]},
        "area": {"squareMetres": square_metres, "hectares": round(square_metres / 10_000, 6)},
    }


def distance_metres(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Straight line distance between two points, by the haversine formula."""
    p1, p2 = math.radians(lat1), math.radians(lat2)
    a = (math.sin((p2 - p1) / 2) ** 2
         + math.cos(p1) * math.cos(p2) * math.sin(math.radians(lng2 - lng1) / 2) ** 2)
    return 2 * _EARTH_RADIUS * math.asin(math.sqrt(a))


def centre(geometry: dict) -> tuple[float, float] | None:
    """The middle of a polygon's bounding box as (latitude, longitude), or None if unusable."""
    polygons = _polygons(geometry)
    if polygons is None:
        return None
    xs = [lng for rings in polygons for ring in rings for lng, _ in ring]
    ys = [lat for rings in polygons for ring in rings for _, lat in ring]
    return (min(ys) + max(ys)) / 2, (min(xs) + max(xs)) / 2


def contains(geometry: dict, latitude: float, longitude: float) -> bool | None:
    """True if the point is inside the polygon (holes excluded), False if not, None if the
    geometry is unusable. A point exactly on an edge counts as outside only by rounding luck."""
    polygons = _polygons(geometry)
    if polygons is None:
        return None

    def inside(ring) -> bool:
        hit = False
        for (x1, y1), (x2, y2) in zip(ring, ring[1:]):
            if (y1 > latitude) != (y2 > latitude):
                crossing = x1 + (latitude - y1) * (x2 - x1) / (y2 - y1)
                if longitude < crossing:
                    hit = not hit
        return hit

    return any(inside(rings[0]) and not any(inside(hole) for hole in rings[1:])
               for rings in polygons)
