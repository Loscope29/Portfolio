"""Génère les images d'aperçu (LinkedIn, X, messageries) du portfolio, 1200 x 630 px.

Usage, depuis le dossier du portfolio :
    python outils/og.py

Écrit og/accueil.png et og/<id>.png pour chaque projet de content/projets.mjs.
À relancer après avoir ajouté un projet ou changé son chiffre clé. Nécessite Node et Pillow.
"""
import json
import math
import random
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

RACINE = Path(__file__).resolve().parent.parent
SORTIE = RACINE / 'og'
W, H = 1200, 630

# Couleurs du thème Console (approximations sRGB des tokens OKLCH)
FOND = (11, 13, 16)
ENCRE = (238, 241, 244)
ENCRE_2 = (201, 207, 214)
GRIS = (139, 147, 160)
FILET = (44, 50, 59)
AMBRE = (242, 178, 58)
FROID = (121, 174, 232)

POLICES = Path('C:/Windows/Fonts')


def police(nom, taille):
    for candidat in (POLICES / nom, Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')):
        if candidat.exists():
            return ImageFont.truetype(str(candidat), taille)
    return ImageFont.load_default(taille)


TITRE = lambda t: police('seguisb.ttf', t)
TEXTE = lambda t: police('segoeui.ttf', t)
MONO = lambda t: police('consola.ttf', t)


def donnees():
    code = (
        "import('./content/projets.mjs').then(m => console.log(JSON.stringify("
        "{secteurs: m.secteurs, projets: m.projets})))"
    )
    sortie = subprocess.run(['node', '--input-type=module', '-e', code], cwd=RACINE,
                            capture_output=True, text=True, encoding='utf-8', check=True)
    return json.loads(sortie.stdout)


def nuage(img, cx, cy, rayon, n_groupes, accent=None, graine=29):
    """Un nuage de points groupés, comme celui de l'accueil."""
    alea = random.Random(graine)
    calque = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(calque)
    centres = []
    for i in range(n_groupes):
        a = i * 2 * math.pi / n_groupes + 0.4
        centres.append((cx + math.cos(a) * rayon * 0.62, cy + math.sin(a) * rayon * 0.62))
    for (gx, gy) in centres:
        for _ in range(90):
            x, y = alea.gauss(gx, rayon * 0.16), alea.gauss(gy, rayon * 0.16)
            r = alea.uniform(0.8, 2.2)
            d.ellipse((x - r, y - r, x + r, y + r), fill=GRIS + (alea.randint(40, 150),))
    for _ in range(260):
        a, rr = alea.uniform(0, 2 * math.pi), rayon * math.sqrt(alea.uniform(0.2, 1.1))
        x, y, r = cx + math.cos(a) * rr, cy + math.sin(a) * rr, alea.uniform(0.6, 1.4)
        d.ellipse((x - r, y - r, x + r, y + r), fill=GRIS + (alea.randint(25, 90),))
    for k, (gx, gy) in enumerate(centres):
        for j in range(2):
            x, y = alea.gauss(gx, rayon * 0.08), alea.gauss(gy, rayon * 0.08)
            d.line((gx, gy, x, y), fill=FILET + (255,), width=1)
            couleur = AMBRE if (accent is not None and k == accent and j == 0) else FROID
            r = 9 if couleur == AMBRE else 6
            d.ellipse((x - r, y - r, x + r, y + r), fill=couleur + (255,))
    img.alpha_composite(calque)


def entete(d):
    d.text((72, 64), 'Luc Obama', font=TITRE(30), fill=ENCRE)
    d.text((72, 102), 'Data scientist et AI engineer, Nantes', font=TEXTE(24), fill=GRIS)


def lignes(texte, fonte, largeur, d):
    mots, ligne, out = texte.split(), '', []
    for m in mots:
        essai = (ligne + ' ' + m).strip()
        if d.textlength(essai, font=fonte) <= largeur:
            ligne = essai
        else:
            out.append(ligne)
            ligne = m
    out.append(ligne)
    return out


def accueil(info):
    img = Image.new('RGBA', (W, H), FOND + (255,))
    nuage(img, 930, 330, 250, len([s for s in info['secteurs'] if any(p['secteur'] == s for p in info['projets'])]), accent=0)
    d = ImageDraw.Draw(img)
    entete(d)
    y = 230
    for l in lignes('Une question métier, un modèle, un chiffre.', TITRE(64), 640, d):
        d.text((72, y), l, font=TITRE(64), fill=ENCRE)
        y += 74
    n = len(info['projets'])
    d.line((72, 520, 640, 520), fill=FILET, width=1)
    d.text((72, 540), f'{n} projets de data science et d’IA, mis en production', font=TEXTE(26), fill=ENCRE_2)
    return img.convert('RGB')


def projet(p, info):
    img = Image.new('RGBA', (W, H), FOND + (255,))
    secteurs = [s for s in info['secteurs'] if any(q['secteur'] == s for q in info['projets'])]
    nuage(img, 1010, 300, 190, len(secteurs), accent=secteurs.index(p['secteur']), graine=sum(map(ord, p['id'])))
    d = ImageDraw.Draw(img)
    entete(d)

    # Pastilles secteur et discipline
    x = 72
    pastilles = [(p['secteur'], None, ENCRE_2)]
    if p['discipline'] != p['secteur']:
        pastilles.append((p['discipline'], (27, 42, 59), ENCRE))
    for etiquette, fond, encre in pastilles:
        f = TEXTE(22)
        larg = d.textlength(etiquette, font=f) + 28
        if fond:
            d.rounded_rectangle((x, 176, x + larg, 214), 6, fill=fond)
        else:
            d.rounded_rectangle((x, 176, x + larg, 214), 6, outline=FILET, width=2)
        d.text((x + 14, 181), etiquette, font=f, fill=encre)
        x += larg + 12

    y = 246
    for l in lignes(p['nom'], TITRE(60), 760, d)[:2]:
        d.text((72, y), l, font=TITRE(60), fill=ENCRE)
        y += 70
    y += 14
    for l in lignes(p['question'], TEXTE(28), 700, d)[:2]:
        d.text((72, y), l, font=TEXTE(28), fill=ENCRE_2)
        y += 38

    d.line((72, 500, 1128, 500), fill=FILET, width=1)
    if p.get('mesure'):
        valeur, unite = p['mesure']['valeur'], p['mesure']['unite']
        # « 71 % » : le nombre en grand, son symbole en petit, comme sur le site
        nombre, _, symbole = valeur.partition(' ')
        x = 72
        d.text((x, 516), nombre, font=MONO(64), fill=AMBRE)
        x += d.textlength(nombre, font=MONO(64)) + 6
        if symbole:
            d.text((x, 544), symbole, font=MONO(30), fill=AMBRE)
            x += d.textlength(symbole, font=MONO(30))
        d.text((x + 20, 548), unite, font=TEXTE(26), fill=GRIS)
    else:
        d.text((72, 540), p['pile'], font=TEXTE(26), fill=GRIS)
    return img.convert('RGB')


def main():
    info = donnees()
    SORTIE.mkdir(exist_ok=True)
    accueil(info).save(SORTIE / 'accueil.png', optimize=True)
    for p in info['projets']:
        projet(p, info).save(SORTIE / f"{p['id']}.png", optimize=True)
    print(f"og/ : accueil.png et {len(info['projets'])} images de projet.")


if __name__ == '__main__':
    sys.exit(main())
