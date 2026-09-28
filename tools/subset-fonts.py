"""Subsets every woff2 in assets/fonts to the characters a Czech bakery site can use.

Google's latin-ext files carry ~500 glyphs for Vietnamese, Polish, Turkish...; Czech needs ~30.
Run after `node tools/build.js` has downloaded the fonts:  tools/.venv/bin/python tools/subset-fonts.py
"""
import glob
import os
from fontTools import subset

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CZECH = "ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽáčďéěíňóřšťúůýžÄäÔôĹĺĽľŔŕÖöÜü"
SYMBOLS = "„“‚‘’–—…•·→←↓↗★☆♡♥✂✺×°€%‰№″′«»"
TEXT = "".join(chr(c) for c in range(0x20, 0x7F)) + "".join(chr(c) for c in range(0xA0, 0x100)) + CZECH + SYMBOLS

for path in sorted(glob.glob(os.path.join(ROOT, "assets/fonts/*.woff2"))):
    before = os.path.getsize(path)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk", "clig"]
    opts.hinting = False
    opts.desubroutinize = True
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    font = subset.load_font(path, opts)
    sub = subset.Subsetter(opts)
    sub.populate(text=TEXT)
    sub.subset(font)
    subset.save_font(font, path, opts)
    print(f"{os.path.basename(path):60s} {before//1024:4d} KB -> {os.path.getsize(path)//1024:4d} KB")
