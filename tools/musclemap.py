#!/usr/bin/env python3
"""Generate anatomy-shapes.js: Liftoff-style muscle "puzzle pieces" for the Godrank muscle map.

Coordinates use the pixel space of assets/anatomy.jpg (1712x1152).
Only the figure's left half (viewer's left) is authored; it is mirrored exactly
around each figure's center line, so the map is perfectly symmetric.

How it works
  1. Body silhouette = left half of the drawing's outline (thresholded), mirrored,
     smoothed, with a clean stylized head + neck replacing the hair.
  2. Each piece is a rough smooth outline (Catmull-Rom through a few control points).
     Pieces are cut out of the silhouette in priority order, so neighbours share a seam.
     Any leftover sliver is merged into the neighbour it shares most border with:
     coverage is always complete (no holes).
  3. Every piece is inset by GAP/2 with rounded corners: thin, even seams.

Requires: numpy, opencv-python-headless, shapely (dev-time only; the app never runs this).
    python3 tools/musclemap.py      # rewrites anatomy-shapes.js
"""
import json, math, os, sys
import cv2, numpy as np
from shapely.geometry import Polygon, MultiPolygon, box
from shapely.ops import unary_union
from shapely import affinity

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAP = 6.0          # seam width in image px
ROUND = 4.0        # corner rounding radius

FIG = {'F': 516, 'B': 1178}   # figure center lines (measured from the drawing's limbs/torso)

# ---------------------------------------------------------------- helpers
def catmull(pts, n=14):
    """closed Catmull-Rom spline through control points -> dense polygon"""
    P = np.array(pts, float); k = len(P); out = []
    for i in range(k):
        p0, p1, p2, p3 = P[(i-1) % k], P[i], P[(i+1) % k], P[(i+2) % k]
        for t in np.linspace(0, 1, n, endpoint=False):
            t2, t3 = t*t, t*t*t
            out.append(0.5*((2*p1) + (-p0+p2)*t + (2*p0-5*p1+4*p2-p3)*t2 + (-p0+3*p1-3*p2+p3)*t3))
    return Polygon(out).buffer(0)

def poly(pts):          # straight-edged polygon (used for cut lines that must stay straight)
    return Polygon(pts).buffer(0)

def parts(g):
    if g.is_empty: return []
    if isinstance(g, Polygon): return [g]
    return [p for p in getattr(g, 'geoms', []) if isinstance(p, Polygon) and not p.is_empty]

def largest(g):
    ps = parts(g); return max(ps, key=lambda p: p.area) if ps else Polygon()

# ---------------------------------------------------------------- silhouette
def head_shape(cx):
    pts = []
    for i in range(72):
        t = 2*math.pi*i/72
        s = math.sin(t)
        rx = 45*(1-0.20*max(0, s)**1.5)        # taper toward the chin
        pts.append((cx+rx*math.cos(t), 122+64*s))
    head = Polygon(pts)
    neck = catmull([(cx-29, 165), (cx-30, 210), (cx-36, 238), (cx+36, 238), (cx+30, 210), (cx+29, 165)], 8)
    return unary_union([head, neck])

def silhouette(key):
    cx = FIG[key]
    im = cv2.imread(os.path.join(ROOT, 'assets/anatomy.jpg'), cv2.IMREAD_GRAYSCALE)
    m = (im > 45).astype(np.uint8)
    m[:218, :] = 0                                   # drop hair/head; drawn clean below
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, k)      # mitten hands, close tiny holes
    m = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 2.5) > 0.5
    m = m.astype(np.uint8)
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    polys = [Polygon(c[:, 0, :]).buffer(0) for c in cs if len(c) > 50]
    body = unary_union([p for p in polys if abs(p.centroid.x-cx) < 260])
    left = body.intersection(box(0, 0, cx, 2000))
    # athletic touch-ups on top of the traced outline: rounder delts, fuller forearms, tighter waist (V-taper)
    ed = EDITS[key]
    left = unary_union([left, head_shape(cx).intersection(box(0, 0, cx, 2000))] + ed['add'])
    for cut in ed['cut']: left = left.difference(cut)
    left = left.buffer(5).buffer(-5)                  # close small notches without bridging arm/torso
    left = left.buffer(-3).buffer(3).simplify(0.4)    # smooth the outline
    left = largest(left).intersection(box(0, 0, cx, 2000))
    return left

def ell(cx, cy, rx, ry, rot=0):
    e = Polygon([(cx+rx*math.cos(t), cy+ry*math.sin(t)) for t in np.linspace(0, 2*math.pi, 64, endpoint=False)])
    return affinity.rotate(e, rot, origin=(cx, cy)) if rot else e

def waist_cut(pts, xmin):
    """region outside a smooth side line (list of (x,y) top->bottom), limited to x>=xmin so arms stay untouched"""
    line = catmull_open(pts)
    return Polygon([(xmin, pts[0][1])] + line + [(xmin, pts[-1][1])]).buffer(0)

def catmull_open(pts, n=12):
    P = np.array([pts[0]] + list(pts) + [pts[-1]], float); out = []
    for i in range(1, len(P)-2):
        p0, p1, p2, p3 = P[i-1], P[i], P[i+1], P[i+2]
        for t in np.linspace(0, 1, n, endpoint=False):
            t2, t3 = t*t, t*t*t
            out.append(tuple(0.5*((2*p1) + (-p0+p2)*t + (2*p0-5*p1+4*p2-p3)*t2 + (-p0+3*p1-3*p2+p3)*t3)))
    out.append(tuple(P[-2])); return out

EDITS = {
  'F': {'add': [ell(391, 300, 30, 50, 8), ell(349, 528, 23, 48, 12)],
        'cut': [waist_cut([(436, 440), (437, 480), (433, 530), (425, 575), (414, 622), (405, 668)], 398)]},
  'B': {'add': [ell(1054, 300, 30, 50, 8), ell(1012, 528, 23, 48, 12)],
        'cut': [waist_cut([(1092, 420), (1100, 465), (1101, 500), (1097, 540), (1090, 580), (1080, 620), (1069, 662)], 1060)]},
}

# ---------------------------------------------------------------- piece layouts (left half)
# (region key, piece name, outline). Order = priority: earlier pieces win overlaps.
# Front center x = 516
FRONT = [
  ('body', 'head',   head_shape(516)),
  ('body', 'hand',   poly([(250, 602), (322, 602), (372, 596), (392, 594), (392, 760), (250, 760)])),
  ('body', 'foot',   poly([(330, 1046), (430, 1042), (470, 1040), (516, 1042), (516, 1200), (330, 1200)])),
  ('body', 'knee',   ell(456, 781, 13, 15)),
  ('traps', 'trap',  catmull([(489, 222), (470, 238), (430, 250), (402, 257), (440, 262), (480, 262), (498, 252)])),
  ('chest', 'pec',   catmull([(516, 262), (470, 262), (440, 267), (428, 288), (425, 315), (428, 338), (450, 352), (480, 358), (516, 356)])),
  ('shoulders', 'frontdelt', catmull([(410, 254), (440, 264), (428, 288), (424, 318), (420, 345), (404, 368), (386, 380), (388, 330), (394, 290)])),
  ('shoulders', 'sidedelt',  catmull([(410, 254), (380, 252), (356, 270), (346, 305), (350, 338), (366, 364), (386, 380), (388, 320), (394, 280)])),
  ('biceps', 'bicep',  catmull([(370, 360), (392, 354), (412, 368), (412, 420), (402, 460), (388, 486), (350, 484), (338, 450), (346, 395)])),
  ('core', 'ab1',    poly([(474, 360), (516, 360), (516, 398), (472, 400)])),
  ('core', 'ab2',    poly([(472, 400), (516, 398), (516, 436), (472, 438)])),
  ('core', 'ab3',    poly([(472, 438), (516, 436), (516, 474), (474, 476)])),
  ('core', 'ablow',  catmull([(474, 476), (516, 474), (516, 540), (516, 596), (508, 598), (494, 562), (480, 516)], 10)),
  ('obliques', 'serratus', catmull([(418, 340), (446, 354), (474, 360), (472, 410), (440, 418), (424, 405), (416, 370)], 10)),
  ('obliques', 'oblique',  catmull([(424, 405), (472, 410), (474, 476), (480, 516), (470, 524), (440, 516), (428, 480), (422, 440)], 10)),
  ('forearms', 'brachio', poly([(300, 486), (362, 484), (353, 520), (345, 550), (340, 575), (343, 600), (300, 600)])),
  ('forearms', 'flexor',  poly([(300, 486), (414, 488), (394, 598), (300, 600)])),
  ('quads', 'adductor', catmull([(516, 598), (512, 640), (500, 672), (486, 678), (479, 640), (481, 592), (489, 558), (504, 582)], 10)),
  ('quads', 'vmo',      catmull([(484, 674), (500, 688), (506, 720), (498, 756), (478, 776), (462, 768), (460, 738), (470, 702)], 10)),
  ('quads', 'rectus',   catmull([(456, 520), (470, 548), (480, 600), (482, 650), (474, 700), (464, 752), (457, 766), (451, 752), (446, 700), (444, 650), (444, 600), (447, 555)], 10)),
  ('quads', 'vlat',     catmull([(380, 500), (456, 512), (447, 555), (444, 600), (444, 650), (446, 700), (450, 742), (452, 772), (446, 800), (420, 800), (400, 700), (396, 600)], 10)),
  ('calves', 'calfin',  catmull([(458, 796), (486, 798), (494, 850), (488, 905), (474, 944), (460, 952), (454, 920), (454, 850)], 10)),
  ('calves', 'shin',    poly([(380, 790), (516, 790), (516, 1046), (380, 1046)])),
]
# Back center x = 1178
BACK = [
  ('body', 'head',   head_shape(1178)),
  ('body', 'hand',   poly([(900, 602), (990, 602), (1032, 598), (1052, 596), (1052, 760), (900, 760)])),
  ('body', 'foot',   poly([(1000, 1046), (1100, 1042), (1130, 1040), (1178, 1042), (1178, 1200), (1000, 1200)])),
  ('body', 'knee',   ell(1117, 794, 11, 15)),
  ('traps', 'trap',  catmull([(1178, 220), (1150, 232), (1100, 252), (1072, 268), (1098, 290), (1136, 318), (1152, 368), (1160, 400), (1164, 420), (1172, 422), (1178, 422)], 8)),
  ('shoulders', 'reardelt', catmull([(1072, 266), (1044, 260), (1024, 282), (1018, 312), (1030, 340), (1060, 342), (1088, 316), (1098, 290)], 10)),
  ('back', 'upper',  catmull([(1098, 290), (1136, 318), (1150, 345), (1120, 350), (1092, 342), (1084, 320)], 10)),
  ('lowerback', 'erector', catmull([(1178, 420), (1166, 420), (1156, 450), (1150, 486), (1156, 510), (1170, 526), (1178, 534)], 8)),
  ('back', 'lat',    catmull([(1084, 335), (1120, 350), (1152, 346), (1160, 392), (1164, 420), (1156, 450), (1150, 486), (1136, 486), (1112, 455), (1094, 418), (1082, 378)], 10)),
  ('glutes', 'glute', catmull([(1178, 546), (1167, 524), (1146, 513), (1124, 518), (1106, 536), (1088, 570), (1090, 604), (1114, 626), (1142, 637), (1164, 635), (1178, 624)], 12)),
  ('obliques', 'flank', catmull([(1060, 395), (1094, 418), (1112, 455), (1136, 486), (1152, 492), (1160, 515), (1130, 510), (1106, 526), (1092, 552), (1070, 545), (1060, 470)], 10)),
  ('triceps', 'tri_lat',  catmull([(980, 336), (1044, 338), (1040, 380), (1034, 430), (1024, 482), (980, 480)], 6)),
  ('triceps', 'tri_long', catmull([(1044, 338), (1084, 340), (1080, 420), (1066, 486), (1024, 482), (1034, 430), (1040, 380)], 6)),
  ('forearms', 'fa_out',  poly([(960, 480), (1024, 482), (1020, 500), (1012, 540), (1008, 575), (1008, 600), (960, 600)])),
  ('forearms', 'fa_in',   poly([(960, 480), (1066, 486), (1054, 598), (960, 600)])),
  ('hams', 'bicfem', catmull([(1062, 600), (1094, 616), (1122, 636), (1120, 690), (1118, 740), (1110, 778), (1102, 798), (1088, 796), (1072, 740), (1064, 680)], 10)),
  ('hams', 'semi',   catmull([(1122, 636), (1150, 642), (1178, 630), (1178, 700), (1162, 750), (1142, 786), (1130, 798), (1122, 780), (1118, 740), (1120, 690)], 10)),
  ('calves', 'gas_out', catmull([(1104, 806), (1080, 812), (1066, 850), (1072, 896), (1092, 930), (1110, 946), (1113, 900), (1113, 840)], 10)),
  ('calves', 'gas_in',  catmull([(1122, 806), (1146, 812), (1160, 850), (1150, 898), (1130, 932), (1114, 946), (1113, 900), (1113, 840)], 10)),
  ('calves', 'soleus',  poly([(1050, 790), (1178, 790), (1178, 1046), (1050, 1046)])),
]

# ---------------------------------------------------------------- build
def build(key, layout):
    cx = FIG[key]
    sil = silhouette(key)
    half = box(0, 0, cx, 2000)
    pieces, taken = [], Polygon()
    for reg, name, shp in layout:
        g = shp.intersection(half).intersection(sil).difference(taken)
        main = largest(g)
        pieces.append([reg, name, main])
        taken = unary_union([taken, main])
    # leftovers: merge each sliver into the muscle it shares most border with
    for _ in range(4):
        rest = sil.difference(unary_union([p[2] for p in pieces]))
        bits = [b for b in parts(rest) if b.area > 0.5]
        if not bits: break
        for b in bits:
            best, bl = None, 0
            for p in pieces:
                l = b.buffer(1.0).intersection(p[2]).area
                if p[0] == 'body': l *= 0.05          # head/hands/feet only take scraps nobody else touches
                if l > bl: best, bl = p, l
            if best is not None:
                best[2] = largest(unary_union([best[2], b.buffer(0.3)]).difference(
                    unary_union([q[2] for q in pieces if q is not best])))
    out = []
    for reg, name, g in pieces:
        if reg == 'body':                             # neutral parts span the midline: mirror before insetting
            g = unary_union([g, affinity.scale(g, -1, 1, origin=(cx, 0))]).buffer(0.5).buffer(-0.5)
            sh = g.buffer(-GAP/2, join_style='round').buffer(-ROUND).buffer(ROUND)
            for p in parts(sh): out.append((reg, name, p))
            continue
        sh = g.buffer(-GAP/2, join_style='round')
        sh = sh.buffer(-ROUND, join_style='round').buffer(ROUND, join_style='round')  # round convex corners
        sh = sh.buffer(ROUND*0.6, join_style='round').buffer(-ROUND*0.6, join_style='round')  # round concave ones
        sh = largest(sh)
        if sh.is_empty: print('empty', key, name, file=sys.stderr); continue
        out.append((reg, name, sh))
        out.append((reg, name, affinity.scale(sh, -1, 1, origin=(cx, 0))))
    return out

def to_d(p, tol=0.45):
    """smooth closed path: quadratic curves through the midpoints of a simplified ring"""
    ring = np.array(p.simplify(tol).exterior.coords)[:-1]
    n = len(ring)
    mids = (ring + np.roll(ring, -1, axis=0))/2
    f = lambda v: f'{v:.1f}'.rstrip('0').rstrip('.')
    d = [f'M{f(mids[-1][0])} {f(mids[-1][1])}']
    for i in range(n):
        d.append(f'Q{f(ring[i][0])} {f(ring[i][1])} {f(mids[i][0])} {f(mids[i][1])}')
    return ''.join(d) + 'Z'

def main():
    shapes, boxes = {}, {}
    for key, layout in (('F', FRONT), ('B', BACK)):
        for reg, name, p in build(key, layout):
            k = f'{key}.{reg}'
            shapes[k] = shapes.get(k, '') + to_d(p)
            b = p.bounds; o = boxes.get(k)
            boxes[k] = [round(v) for v in (b if not o else (min(o[0], b[0]), min(o[1], b[1]), max(o[2], b[2]), max(o[3], b[3])))]
    js = ('// Muscle map puzzle pieces (Liftoff style), generated by tools/musclemap.py. Do not edit by hand.\n'
          '// Coordinates: assets/anatomy.jpg pixel space (1712x1152). Front figure centered on x=516, back on x=1178.\n'
          '// Each key holds every piece of that region (left + right side) as subpaths. "body" = head, hands, feet.\n'
          'window.MUSCLE_SHAPES=' + json.dumps(shapes, indent=0) + ';\n'
          'window.MUSCLE_BOX=' + json.dumps(boxes) + ';\n')
    open(os.path.join(ROOT, 'anatomy-shapes.js'), 'w').write(js)
    print('wrote anatomy-shapes.js', len(js), 'bytes', sorted(shapes))


def debug(path='/tmp/musclemap-debug.png'):
    """dev aid: every piece in its own color with its name, over the drawing"""
    im = cv2.imread(os.path.join(ROOT, 'assets/anatomy.jpg'))
    im = (im*0.35).astype(np.uint8)
    rng = np.random.default_rng(3)
    for key, layout in (('F', FRONT), ('B', BACK)):
        for reg, name, p in build(key, layout):
            c = [int(v) for v in rng.integers(60, 255, 3)]
            cv2.fillPoly(im, [np.array(p.exterior.coords, np.int32)], c)
            if p.centroid.x < FIG[key]:
                x, y = p.representative_point().coords[0]
                cv2.putText(im, name, (int(x)-15, int(y)), 0, 0.33, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.imwrite(path, im)

if __name__ == '__main__':
    debug() if '--debug' in sys.argv else main()
