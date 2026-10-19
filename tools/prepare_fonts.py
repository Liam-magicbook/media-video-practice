from pathlib import Path
import requests,json
from concurrent.futures import ThreadPoolExecutor
from fontTools import subset
ROOT=Path(__file__).resolve().parents[1]
fonts=ROOT/'assets/fonts';raw=ROOT/'research/font-originals';raw.mkdir(exist_ok=True)
items=[('notosanssc','NotoSansSC[wght].ttf','sans.ttf'),('notoserifsc','NotoSerifSC[wght].ttf','serif.ttf'),('barlowcondensed','BarlowCondensed-Bold.ttf','numbers.ttf')]
# Keep every character currently used by the film; source screenshots retain their original typography.
chars=''.join((ROOT/n).read_text() for n in ['film.js','craft.js','timeline.js','film.html'])+''.join(chr(i) for i in range(32,127))+'“”‘’：；，。！？、（）《》—×≠→·…'
def get(it):
 folder,name,out=it;url='https://raw.githubusercontent.com/google/fonts/main/ofl/'+folder+'/'+requests.utils.quote(name)
 p=raw/name
 if not p.exists():
  r=requests.get(url,timeout=60);r.raise_for_status();p.write_bytes(r.content)
 opts=subset.Options();opts.layout_features=['*'];opts.name_IDs=['*'];opts.notdef_glyph=True;opts.recommended_glyphs=True
 font=subset.load_font(p,opts);sub=subset.Subsetter(options=opts);sub.populate(text=chars);sub.subset(font);subset.save_font(font,fonts/out,opts)
 lic=requests.get('https://raw.githubusercontent.com/google/fonts/main/ofl/'+folder+'/OFL.txt',timeout=30);lic.raise_for_status();(fonts/(folder+'-OFL.txt')).write_text(lic.text)
 return {'family':folder,'file':out,'source':url,'bytes':(fonts/out).stat().st_size}
with ThreadPoolExecutor(max_workers=3) as pool: records=list(pool.map(get,items))
(fonts/'sources.json').write_text(json.dumps(records,indent=2));print(records)
