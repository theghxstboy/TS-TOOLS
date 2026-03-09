import os
import requests
from urllib.parse import urlparse

niches = {
    "construction": {
        "banner": "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/banner-construction.webp",
        "content": [
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-construction-grading.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-construction-excavation.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-construction-framing.webp"
        ]
    },
    "flooring": {
        "banner": "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2024/11/banner-flooring-ts-explore.webp",
        "content": ["https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2024/12/img-flooring-geral-1.webp"]
    },
    "siding": {
        "banner": "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2024/12/banner-siding-desk.webp",
        "content": [
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2024/12/img-remocao-siding.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2024/12/img-flashing-tape.webp"
        ]
    },
    "roofing": {
        "banner": "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2024/12/banner-roofing.webp",
        "content": [
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2024/12/img-roofing-preparacao.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2024/12/img-roofing-reparo-deck.webp"
        ]
    },
    "remodeling": {
        "banner": "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/banner-remodeling.webp",
        "content": [
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-remodeling-design.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-remodeling-demolition.webp"
        ]
    },
    "carpentry": {
        "banner": "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/banner-carpentry-.webp",
        "content": ["https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-carpentry-trim-molding.webp"]
    },
    "painting": {
        "banner": "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/banner-painting.webp",
        "content": ["https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-painting-prep-interior.webp"]
    },
    "cleaning": {
        "banner": "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/banner-cleaning.webp",
        "content": ["https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-cleaning-deep-cleaning.webp"]
    },
    "insulation": {
        "banner": "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/banner-new-insulation.webp",
        "content": [
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-insulation-florida-2.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-insulation-cleaning.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-insulation-material.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-insulation-mantas.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-insulation-ventilacao.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-insulation-fiberglass.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-insulation-cellulose.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-insulation-mineral-wool.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-insulation-spray-foam.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-insulation-rigid-foam.webp"
        ]
    },
    "framing": {
        "banner": "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/banner-framing.webp",
        "content": [
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-framing-foundation-walls.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-framing-lumber.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-framing-framing-piso.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-framing-steel-frame.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-framing-framing-paredes.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-framing-framing-telhado.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-framing-wraping.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-framing-inspecao.webp"
        ]
    },
    "additions": {
        "banner": "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/banner-new-addition.webp",
        "content": [
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-additions-fundacao.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-additions-framing.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-additions-plumbing.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-additions-acabamento-exteriior.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-additions-acabamento-interior.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-additions-toques-finais.webp"
        ]
    },
    "landscaping": {
        "banner": "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/banner-new-landscape.webp",
        "content": [
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-landscaping-handscaping.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-landscaping-softscaping.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-landscaping-cuidado-gramado.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-landscaping-irrigacao.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-landscaping-iluminacao.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-landscaping-parede-contencao.webp"
        ]
    },
    "countertops": {
        "banner": "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/02/banner-countertop.webp",
        "content": [
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/02/img-card-medidas.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/02/img-countertop-remocao.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/02/img-countertop-preparacao.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/02/img-countertop-fabricacao.webp"
        ]
    },
    "estetica": {
        "banner": "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/banner-estetica.webp",
        "content": [
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-estetica-skincare.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-estetica-hair.webp",
            "https://tsexplore.trajetoriadosucesso.com.br/wp-content/uploads/2025/01/img-estetica-nail.webp"
        ]
    }
}

BASE_DIR = "public/images/niches"

def download_image(url, dest_folder):
    if not url: return None
    try:
        response = requests.get(url, stream=True, timeout=10)
        if response.status_code == 200:
            filename = os.path.basename(urlparse(url).path)
            if not filename.endswith('.webp'):
                filename += '.webp'
            
            filepath = os.path.join(dest_folder, filename)
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"Downloaded: {filename}")
            return f"/images/niches/{os.path.basename(dest_folder)}/{filename}"
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return None

for niche_id, data in niches.items():
    niche_path = os.path.join(BASE_DIR, niche_id)
    os.makedirs(niche_path, exist_ok=True)
    
    print(f"\nProcessing niche: {niche_id}")
    download_image(data['banner'], niche_path)
    for url in data['content']:
        download_image(url, niche_path)

print("\nAll downloads finished.")
