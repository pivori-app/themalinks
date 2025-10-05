#!/usr/bin/env python3
"""
Script pour tester la compatibilité iframe des liens fournis.
Analyse les en-têtes HTTP pour détecter X-Frame-Options et CSP frame-ancestors.
"""

import requests
import csv
import json
from urllib.parse import urlparse
import time
import re

# Liste complète des liens à tester
LINKS = [
    # Voiture
    "https://www.auto1.com/fr/home",
    "https://starmycar.com",
    "https://www.carcarekiosk.com/",
    
    # TV & Streaming
    "https://wavewatch-beta-v19.vercel.app/",
    "https://desicinemas.pk/",
    "https://nakios.site/tv",
    "https://www.novovue.fr/",
    "https://moviepire.net/",
    "https://dl3.wavewatch.xyz/",
    "https://xalaflix.art/movies",
    "https://nunflix.org/",
    "https://purstream.to/",
    "https://www.empire-stream.fr/",
    "https://nova-stream.live/",
    "https://ufrov.com/",
    "https://flixer.su/",
    "https://netmirror.app/1/en",
    "https://myretrotvs.com",
    "https://tv.garden",
    "https://www.xataf.com/",
    "https://movix.website/",
    "https://www.j2n.fr/",
    "https://netaklap.com/wmu81z7hp/home/netaklap/",
    "https://xprime.tv/",
    "https://www.cineby.app/",
    "https://www.bitcine.app/",
    "https://www.fmovies.gd/home",
    "https://footballia.eu/",
    
    # Astuce Streaming
    "https://www.teleparty.com/",
    "https://www.netflix-codes.com/fr",
    "https://shotdeck.com/",
    
    # Streaming Live
    "https://v2.gostreameast.link/",
    "https://tvpass.org/",
    "https://www.livehdtv.com/",
    "https://zhangboheng.github.io/Easy-Web-TV-M3u8/routes/countries.html",
    
    # Manga
    "https://v6.voiranime.com/",
    "https://kaa.to/",
    "https://hianime.to/",
    "https://animenosub.to/",
    
    # Software/App
    "https://www.downloadha.com/",
    "https://diakov.net/",
    "https://audioz.download/",
    "https://aedownload.com/",
    "https://www.downloadpirate.com/",
    "https://scloud.ws/",
    "https://starkmods.net/",
    
    # Gaming
    "https://arcadespot.com/",
    "https://playclassic.games/",
    "https://www.retrogames.onl/",
    "https://dodi-repacks.download/",
    "https://gog-games.to/game/parkitect",
    "https://fitgirl-repacks.site/",
    "https://online-fix.me/",
    "https://elamigos.site/#TopOfPage",
    "https://m4ckd0ge-repacks.site/index.html",
    "https://steamrip.com/",
    "https://steamgg.net/",
    "https://ankergames.net/",
    "https://builditapp.com/",
    "https://www.geo-fs.com/",
    "https://www.emugames.com/",
    "https://www.airconsole.com/",
    
    # Trainer
    "https://www.emuparadise.me/",
    "https://www.wemod.com/fr",
    "https://fearlessrevolution.com/",
    "https://flingtrainer.com/",
    
    # Livre
    "https://rivestream.org/manga",
    "https://fr.z-lib.gd/",
    "https://audiobookbay.lu/",
    "https://fulllengthaudiobooks.net/",
    "https://gallica.bnf.fr",
    "https://openlibrary.org/",
    "https://librivox.org/",
    "https://www.onread.com/",
    "https://sobrief.com/",
    
    # Urbex
    "https://easyurbex.com/free-urbex-map/",
    "https://urbexology.com/fr.html",
    "https://urbexsession.com/",
    
    # Apprendre
    "https://www.lingohut.com/fr",
    "https://labs.google/lll/fr",
    "https://www.loecsen.com/fr",
    "https://human.biodigital.com/explore",
    "https://animagraffs.com/",
    "https://www.oldmapsonline.org/en#position=5/46.87/-1.02",
    "https://www.classcentral.com/",
    "https://www.cymath.com/",
    "https://exercism.org/",
    "https://www.wolframalpha.com/",
    "https://imagineexplainers.com/",
    "https://phet.colorado.edu/",
    "https://www.symbolab.com/",
    "https://makemydrivefun.com/",
    
    # Réparer
    "https://fr.ifixit.com/",
    "https://fr.carcarekiosk.com/",
    "https://www.manualslib.com/",
    
    # Sport & Fitness
    "https://www.workout.cool/fr",
    "https://darebee.com/",
    "https://musclewiki.com/fr-fr",
    
    # Cuisine
    "https://www.chefgpt.xyz/fr",
    "https://myfridgefood.com/",
    "https://www.750g.com",
    "https://cuisine-libre.org",
    
    # Musique & Audio
    "https://radiocast.co/",
    "https://www.radio.garden",
    "https://soundation.com",
    "https://ncs.io/",
    "https://musicgpt.com/",
    
    # Convertisseur
    "https://cnvmp3.com/v33",
    "https://downloadmusicschool.com/bandcamp/",
    "https://eu.doubledouble.top/",
    "https://cobalt.tools/",
    "https://ezconv.com/",
    "https://azmp3.cc/",
    "https://shailen.dedyn.io/racoon/",
    
    # Enfant - Créativité
    "https://sketch.io/sketchpad/",
    "https://colorifyai.art/",
    "https://yoprintables.com",
    "https://www.kiddoworksheets.com/",
    
    # Voyage & Culture
    "https://artsandculture.google.com/",
    "https://www.seterra.com/",
    "https://fr.gallerix.ru/",
    
    # Divers
    "https://tjukanovt.github.io/notable-people",
    
    # Astuce
    "https://www.spoken.io/",
    "https://ninite.com/",
    "https://www.wifimap.io/",
    "https://geospy.ai/",
    
    # Téléphone
    "https://sms24.me/en",
    "https://receive-smss.com/",
    
    # Informatique
    "https://tinywow.com/",
    "https://www.prepostseo.com/",
    
    # Immobilier
    "https://www.planyourroom.com/",
    "https://app.topoexport.com/",
    "https://collov.ai/"
]

def test_iframe_compatibility(url):
    """
    Teste la compatibilité iframe d'une URL en analysant les en-têtes HTTP.
    """
    result = {
        'url': url,
        'domain': urlparse(url).netloc,
        'status_code': None,
        'x_frame_options': None,
        'csp_frame_ancestors': None,
        'iframe_compatible': None,
        'risk_level': None,
        'notes': []
    }
    
    try:
        # Configuration de la requête avec un user-agent réaliste
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        
        # Requête HEAD pour récupérer seulement les en-têtes
        response = requests.head(url, headers=headers, timeout=10, allow_redirects=True)
        result['status_code'] = response.status_code
        
        # Analyse de X-Frame-Options
        x_frame_options = response.headers.get('X-Frame-Options', '').upper()
        result['x_frame_options'] = x_frame_options
        
        # Analyse de Content-Security-Policy pour frame-ancestors
        csp = response.headers.get('Content-Security-Policy', '')
        frame_ancestors_match = re.search(r"frame-ancestors\s+([^;]+)", csp, re.IGNORECASE)
        if frame_ancestors_match:
            result['csp_frame_ancestors'] = frame_ancestors_match.group(1).strip()
        
        # Détermination de la compatibilité iframe
        if x_frame_options in ['DENY', 'SAMEORIGIN']:
            result['iframe_compatible'] = False
            result['risk_level'] = 'HIGH'
            result['notes'].append(f"X-Frame-Options: {x_frame_options} bloque l'iframe")
        elif result['csp_frame_ancestors'] and "'none'" in result['csp_frame_ancestors']:
            result['iframe_compatible'] = False
            result['risk_level'] = 'HIGH'
            result['notes'].append("CSP frame-ancestors 'none' bloque l'iframe")
        elif result['csp_frame_ancestors'] and "'self'" in result['csp_frame_ancestors']:
            result['iframe_compatible'] = False
            result['risk_level'] = 'HIGH'
            result['notes'].append("CSP frame-ancestors 'self' bloque l'iframe externe")
        else:
            result['iframe_compatible'] = True
            result['risk_level'] = 'LOW'
            result['notes'].append("Aucune restriction iframe détectée dans les en-têtes")
        
        # Analyse du domaine pour des risques spécifiques
        domain_lower = result['domain'].lower()
        
        # Sites de streaming connus pour bloquer l'iframe
        streaming_domains = ['netflix', 'youtube', 'twitch', 'hulu', 'disney', 'amazon', 'apple']
        if any(streaming in domain_lower for streaming in streaming_domains):
            result['iframe_compatible'] = False
            result['risk_level'] = 'HIGH'
            result['notes'].append("Plateforme de streaming majeure - bloque généralement l'iframe")
        
        # Sites de téléchargement/piratage - risque élevé
        risky_keywords = ['download', 'pirate', 'crack', 'repack', 'torrent', 'warez']
        if any(keyword in domain_lower for keyword in risky_keywords):
            result['risk_level'] = 'VERY_HIGH'
            result['notes'].append("Site de téléchargement/piratage - risque juridique et sécurité")
        
        # Sites éducatifs/gouvernementaux - généralement sûrs
        safe_keywords = ['edu', 'gov', 'gallica', 'bnf', 'openlibrary', 'librivox']
        if any(keyword in domain_lower for keyword in safe_keywords):
            result['risk_level'] = 'VERY_LOW'
            result['notes'].append("Site éducatif/gouvernemental - généralement sûr")
            
    except requests.exceptions.Timeout:
        result['notes'].append("Timeout - site trop lent")
        result['risk_level'] = 'MEDIUM'
    except requests.exceptions.ConnectionError:
        result['notes'].append("Erreur de connexion - site inaccessible")
        result['risk_level'] = 'HIGH'
    except Exception as e:
        result['notes'].append(f"Erreur: {str(e)}")
        result['risk_level'] = 'MEDIUM'
    
    return result

def main():
    """
    Fonction principale pour tester tous les liens et générer le rapport.
    """
    print("🔍 Début de l'analyse de compatibilité iframe...")
    print(f"📊 {len(LINKS)} liens à analyser\n")
    
    results = []
    
    for i, url in enumerate(LINKS, 1):
        print(f"[{i:3d}/{len(LINKS)}] Test de {url}")
        result = test_iframe_compatibility(url)
        results.append(result)
        
        # Affichage du résultat
        status = "✅ COMPATIBLE" if result['iframe_compatible'] else "❌ BLOQUÉ"
        risk = result['risk_level']
        print(f"           → {status} (Risque: {risk})")
        
        # Pause pour éviter de surcharger les serveurs
        time.sleep(0.5)
    
    # Sauvegarde des résultats en JSON
    with open('/home/ubuntu/iframe_compatibility_results.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    # Sauvegarde des résultats en CSV
    with open('/home/ubuntu/iframe_compatibility_results.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'url', 'domain', 'status_code', 'x_frame_options', 'csp_frame_ancestors',
            'iframe_compatible', 'risk_level', 'notes'
        ])
        writer.writeheader()
        for result in results:
            # Convertir la liste des notes en chaîne
            result_copy = result.copy()
            result_copy['notes'] = '; '.join(result['notes'])
            writer.writerow(result_copy)
    
    # Statistiques
    compatible_count = sum(1 for r in results if r['iframe_compatible'])
    blocked_count = len(results) - compatible_count
    
    print(f"\n📈 RÉSULTATS FINAUX:")
    print(f"   ✅ Compatible iframe: {compatible_count} ({compatible_count/len(results)*100:.1f}%)")
    print(f"   ❌ Bloqué iframe: {blocked_count} ({blocked_count/len(results)*100:.1f}%)")
    
    # Répartition par niveau de risque
    risk_counts = {}
    for result in results:
        risk = result['risk_level']
        risk_counts[risk] = risk_counts.get(risk, 0) + 1
    
    print(f"\n🎯 RÉPARTITION PAR NIVEAU DE RISQUE:")
    for risk, count in sorted(risk_counts.items()):
        print(f"   {risk}: {count} sites")
    
    print(f"\n💾 Résultats sauvegardés dans:")
    print(f"   - iframe_compatibility_results.json")
    print(f"   - iframe_compatibility_results.csv")

if __name__ == "__main__":
    main()
