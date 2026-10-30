"""Optional font preparation; production builds use the committed WOFF2 files.

Requires fonttools[woff]. Run after npm ci; retain public/licenses notices.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

output = Path('public/fonts')
output.mkdir(parents=True, exist_ok=True)
source = Path('node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2')
for weight in (400, 500, 600):
    font = TTFont(source)
    coordinates = {axis.axisTag: weight if axis.axisTag == 'wght' else axis.defaultValue for axis in font['fvar'].axes}
    font = instantiateVariableFont(font, coordinates, inplace=True)
    font.flavor = 'woff2'
    font.save(output / f'dm-sans-{weight}.woff2')

font = TTFont('node_modules/@fontsource/caveat/files/caveat-latin-500-normal.woff2')
options = subset.Options()
options.flavor = 'woff2'
options.name_IDs = ['*']
options.name_legacy = True
options.name_languages = ['*']
subsetter = subset.Subsetter(options=options)
subsetter.populate(text='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,!&’–-')
subsetter.subset(font)
font.flavor = 'woff2'
font.save(output / 'caveat-script.woff2')
for file in output.glob('*.woff2'):
    print(f'{file}: {file.stat().st_size} bytes')
