"""Polygons the source holds, turned into the standard's boundary."""

from dpr_pipeline import geo

PLOT = {"type": "Polygon", "coordinates": [[
    [-0.1221, 51.5214], [-0.1219, 51.5214], [-0.1219, 51.5216], [-0.1221, 51.5216],
    [-0.1221, 51.5214]]]}


def test_a_polygon_becomes_a_site_with_its_own_area_and_bbox():
    boundary = geo.boundary_from_geometry(PLOT)
    assert boundary["site"]["geometry"] == PLOT
    assert boundary["site"]["bbox"] == [-0.1221, 51.5214, -0.1219, 51.5216]
    # 0.0002 degrees of longitude is about 13.9 m here and 0.0002 of latitude about 22.3 m
    assert 300 < boundary["area"]["squareMetres"] < 320
    assert boundary["area"]["hectares"] == round(boundary["area"]["squareMetres"] / 10_000, 6)


def test_the_area_agrees_with_the_square_the_pipeline_builds_itself():
    square = geo.site_boundary(51.5215, -0.1220)
    again = geo.boundary_from_geometry(square["site"]["geometry"])
    assert abs(again["area"]["squareMetres"] - square["area"]["squareMetres"]) < 0.5


def test_a_hole_is_taken_out_of_the_area():
    hole = [[-0.12205, 51.52145], [-0.12195, 51.52145], [-0.12195, 51.52155],
            [-0.12205, 51.52155], [-0.12205, 51.52145]]
    with_hole = {"type": "Polygon", "coordinates": PLOT["coordinates"] + [hole]}
    assert geo.area_square_metres(with_hole) < geo.area_square_metres(PLOT)


def test_a_multipolygon_adds_its_parts_together():
    other = [[[-0.13, 51.53], [-0.1299, 51.53], [-0.1299, 51.5301], [-0.13, 51.5301], [-0.13, 51.53]]]
    multi = {"type": "MultiPolygon", "coordinates": [PLOT["coordinates"], other]}
    boundary = geo.boundary_from_geometry(multi)
    assert boundary["site"]["geometry"]["type"] == "MultiPolygon"
    assert boundary["area"]["squareMetres"] > geo.area_square_metres(PLOT)


def test_an_open_ring_is_closed():
    open_ring = {"type": "Polygon", "coordinates": [PLOT["coordinates"][0][:-1]]}
    ring = geo.boundary_from_geometry(open_ring)["site"]["geometry"]["coordinates"][0]
    assert ring[0] == ring[-1]


def test_anything_unusable_is_refused_not_guessed():
    for bad in (None, "", {}, {"type": "Point", "coordinates": [0, 0]},
                {"type": "Polygon", "coordinates": []},
                {"type": "Polygon", "coordinates": [[[0, 0], [1, 1]]]},
                {"type": "Polygon", "coordinates": [[[0, 0], [1, 1], [1, 0], [1, "x"]]]},
                {"type": "Polygon", "coordinates": [[[0, 0], [200, 1], [1, 0], [0, 0]]]},
                {"type": "Polygon", "coordinates": [[[0, 0], [0, 1], [0, 2], [0, 0]]]}):
        assert geo.boundary_from_geometry(bad) is None, bad


def test_distance_and_centre():
    assert 68 < geo.distance_metres(51.5, -0.1, 51.5, -0.099) < 70
    assert geo.centre(PLOT) == (51.5215, -0.122)
    assert geo.centre({"type": "Point"}) is None
