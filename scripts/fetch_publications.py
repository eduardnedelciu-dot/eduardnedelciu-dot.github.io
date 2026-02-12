import json
import os
from scholarly import scholarly

AUTHOR_ID = 'o_gSlnwAAAAJ'
OUTPUT_FILE = 'data/publications.json'

def fetch_publications():
    print(f"Fetching publications for author ID: {AUTHOR_ID}")
    try:
        author = scholarly.search_author_id(AUTHOR_ID)
        scholarly.fill(author, sections=['publications'])
        
        publications = []
        for pub in author['publications']:
            scholarly.fill(pub)
            bib = pub['bib']
            
            pub_data = {
                'title': bib.get('title'),
                'authors': bib.get('author'),
                'venue': bib.get('venue') or bib.get('journal') or bib.get('conference'),
                'year': bib.get('pub_year'),
                'link': pub.get('pub_url')
            }
            publications.append(pub_data)
            
        # Sort by year descending
        publications.sort(key=lambda x: x.get('year', '0'), reverse=True)
        
        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
        with open(OUTPUT_FILE, 'w') as f:
            json.dump(publications, f, indent=4)
            
        print(f"Successfully saved {len(publications)} publications to {OUTPUT_FILE}")
        
    except Exception as e:
        print(f"Error fetching publications: {e}")

if __name__ == "__main__":
    fetch_publications()
