import json
import os
import re
import requests
from datetime import datetime
from scholarly import scholarly
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

# Configuration
AUTHOR_ID = 'xpVXHpcAAAAJ'
PUBLICATIONS_FILE = 'src/data/publications.json'
NEWS_FILE = 'src/data/news.json'
MY_NAME_VARIANTS = ["Mingchen Li", "M Li", "M. Li", "Ming-Chen Li"]
BLACKLIST_VENUES = ["SSRN"]
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

# Initialize OpenAI Client
api_key = os.getenv("OPENAI_API_KEY")
base_url = os.getenv("OPENAI_BASE_URL")

if api_key:
    client = OpenAI(api_key=api_key, base_url=base_url)
else:
    client = None

def load_json(filepath):
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def generate_id(title, year):
    # Remove special characters and keep spaces/alphanumeric
    clean_title = ''.join(c if c.isalnum() or c.isspace() else ' ' for c in title.lower())
    words = clean_title.split()
    # Use up to 6 words for better uniqueness
    slug = '-'.join(words[:6])
    return f"{slug}-{year}"

def is_me(author_name):
    return any(variant.lower() in author_name.lower() for variant in MY_NAME_VARIANTS)

def analyze_author_role(authors):
    """
    Analyze my role in the author list.
    Returns: 'first', 'corresponding', 'co-first', or 'other'
    """
    cleaned_authors = [a.strip() for a in authors]
    
    my_index = -1
    for i, author in enumerate(cleaned_authors):
        if is_me(author):
            my_index = i
            break
    
    if my_index == -1:
        return 'other'
    
    if my_index == 0:
        return 'first'
    
    # Heuristic: Last author is often corresponding
    if my_index == len(cleaned_authors) - 1:
        return 'corresponding'
        
    return 'other'

def generate_yearly_summary(year, papers, authors_stats):
    """
    Generate a yearly summary using AI or robust fallback.
    """
    paper_titles = [p['title'] for p in papers]
    # Get top 3 authors
    top_authors = list(authors_stats.keys())[:3]
    # Get top venues
    venues = list(set(p['venue'] for p in papers if p['venue']))
    top_venues = venues[:3]  # Just take first 3 unique ones

    # Construct robust fallback text
    fallback_title = f"Research Summary {year}"
    fallback_desc = f"Published {len(papers)} papers in {year}"
    if venues:
        fallback_desc += f" in venues such as {', '.join(top_venues)}."
    else:
        fallback_desc += "."
    
    if top_authors:
        fallback_desc += f" Collaborated with {', '.join(top_authors)} and others."

    if not client:
        return fallback_title, fallback_desc

    prompt = f"""
    Write a short, engaging yearly research summary for my personal website news section in the third person (but warm tone) or first person professional.
    
    Year: {year}
    Number of Publications: {len(papers)}
    Paper Titles: {', '.join(paper_titles)}
    Key Venues: {', '.join(top_venues)}
    Key Collaborators: {', '.join(list(authors_stats.keys())[:5])}
    
    Requirements:
    1. Title: "Yearly Research Summary: [Year]" or something similar.
    2. Description: 2-3 sentences summarizing the key research themes.
    3. MANDATORY: Explicitly mention and thank key collaborators (e.g., "Collaborated closely with...", "Special thanks to...").
    
    Output format: JSON with keys 'title' and 'description'.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        content = json.loads(response.choices[0].message.content)
        return content.get('title'), content.get('description')
    except Exception as e:
        print(f"AI Generation failed: {e}")
        return fallback_title, fallback_desc

def fetch_publications_serpapi(author_id, api_key):
    """
    Fetch publications using SerpAPI directly.
    """
    print(f"Fetching data from SerpAPI for author ID: {author_id}")
    params = {
        "engine": "google_scholar_author",
        "author_id": author_id,
        "api_key": api_key,
        "hl": "en",
        "num": 100 # Fetch up to 100 papers
    }
    
    try:
        response = requests.get("https://serpapi.com/search.json", params=params)
        response.raise_for_status()
        data = response.json()
        
        if "error" in data:
            raise Exception(data["error"])
            
        return data.get("articles", [])
    except Exception as e:
        print(f"SerpAPI request failed: {e}")
        return []

def fetch_publications_scholarly(author_id):
    """
    Fetch publications using scholarly (direct connection).
    """
    print(f"Fetching data using scholarly (direct) for author ID: {author_id}")
    try:
        author = scholarly.search_author_id(author_id)
        scholarly.fill(author, sections=['publications'])
        return author['publications']
    except Exception as e:
        print(f"Scholarly request failed: {e}")
        return []

def fetch_paper_details_serpapi(citation_id, api_key):
    """
    Fetch detailed paper info (abstract, etc.) using SerpAPI.
    citation_id format: "user_id:paper_id"
    """
    print(f"  Fetching details for citation_id: {citation_id}")
    params = {
        "engine": "google_scholar_author",
        "view_op": "view_citation",
        "citation_id": citation_id,
        "api_key": api_key,
        "hl": "en"
    }
    
    try:
        response = requests.get("https://serpapi.com/search.json", params=params)
        response.raise_for_status()
        data = response.json()
        
        if "error" in data:
            print(f"  SerpAPI Error: {data['error']}")
            return {}
            
        return data.get("citation", {})
    except Exception as e:
        print(f"  SerpAPI request failed: {e}")
        return {}

def update_publications():
    existing_publications = {p['id']: p for p in load_json(PUBLICATIONS_FILE)}
    existing_news = load_json(NEWS_FILE)
    
    # ... (news filtering logic remains same) ...
    career_news = []
    for item in existing_news:
        if not item.get('related_paper_id') and item.get('category') != 'publication':
            if 'category' not in item:
                item['category'] = 'career'
            career_news.append(item)
            
    # FETCH DATA
    raw_publications = []
    using_serpapi = False
    
    if SERPAPI_KEY:
        print("Using SerpAPI...")
        raw_publications = fetch_publications_serpapi(AUTHOR_ID, SERPAPI_KEY)
        using_serpapi = True
    else:
        print("Using direct connection (scholarly)...")
        raw_publications = fetch_publications_scholarly(AUTHOR_ID)

    if not raw_publications:
        print("No publications found or error occurred.")
        return

    publications_data = []
    papers_by_year = {}
    
    print(f"Found {len(raw_publications)} publications.")

    # Track changes
    has_new_papers = False
    has_citation_updates = False
    new_paper_titles = []

    for i, pub in enumerate(raw_publications):
        # Normalize data structure between SerpAPI and scholarly
        if using_serpapi:
            title = pub.get('title', '').strip()
            year_str = pub.get('year', str(datetime.now().year))
            year = int(year_str) if str(year_str).isdigit() else datetime.now().year
            
            citations = pub.get('cited_by', {}).get('value')
            if citations is None:
                citations = 0
                
            link = pub.get('link', '')
            authors_str = pub.get('authors', 'Mingchen Li')
            authors_list = [a.strip() for a in authors_str.split(',')]
            venue = pub.get('publication', 'Unknown Venue')
            pub_id_source = pub.get('citation_id', '') # SerpAPI specific
        else:
            title = pub['bib']['title'].strip()
            year = int(pub['bib'].get('pub_year', datetime.now().year))
            citations = pub.get('num_citations', 0)
            link = pub.get('pub_url', '')
            # Scholarly usually doesn't give full author list in list view without fill()
            # We might need to fill if it's a new paper
            authors_list = [] 
            venue = pub['bib'].get('venue', pub['bib'].get('journal', 'Unknown Venue'))
        
        pub_id = generate_id(title, year)
        
        # --- BLACKLIST CHECK ---
        if any(b.lower() in venue.lower() for b in BLACKLIST_VENUES):
            print(f"Skipping blacklisted venue: {title} ({venue})")
            continue

        print(f"Processing: {title} (ID: {pub_id})")

        # --- OPTIMIZATION LOGIC ---
        if pub_id in existing_publications:
            # EXISTING PAPER: Update citations ONLY.
            existing_entry = existing_publications[pub_id]
            
            if existing_entry.get('citations', 0) != citations:
                existing_entry['citations'] = citations
                has_citation_updates = True
                print(f"  [UPDATE] Citations: {existing_entry.get('citations', 0)} -> {citations}")
            else:
                print(f"  [SKIP] No changes.")
            
            new_pub_entry = existing_entry
        else:
            # NEW PAPER
            print(f"  [NEW] Fetching details...")
            
            abstract = ""
            scholar_url = ""
            
            # If scholarly, we need to fill() to get details
            if not using_serpapi:
                try:
                    scholarly.fill(pub)
                    authors_str = pub['bib'].get('author', 'Mingchen Li')
                    authors_list = [a.strip() for a in authors_str.replace(' and ', ',').split(',')]
                    if ' and ' in authors_str:
                         authors_list = authors_str.split(' and ')
                    venue = pub['bib'].get('venue', pub['bib'].get('journal', 'Unknown Venue'))
                    abstract = pub['bib'].get('abstract', '')
                    link = pub.get('pub_url', '')
                    cites_id = pub.get('cites_id', [''])[0] if isinstance(pub.get('cites_id'), list) else pub.get('cites_id', '')
                    scholar_url = f"https://scholar.google.com/citations?view_op=view_citation&hl=en&user={AUTHOR_ID}&citation_for_view={AUTHOR_ID}:{cites_id}" if cites_id else ""
                except Exception as e:
                    print(f"Error filling publication '{title}': {e}")
                    continue
            else:
                # SerpAPI: Fetch details for abstract
                if pub_id_source:
                    details = fetch_paper_details_serpapi(pub_id_source, SERPAPI_KEY)
                    abstract = details.get('description', '') # SerpAPI citation endpoint uses 'description' for abstract
                    # Update other fields if available in details
                    if 'title' in details: title = details['title']
                    if 'authors' in details: 
                        authors_str = details['authors']
                        authors_list = [a.strip() for a in authors_str.split(',')]
                    if 'publication_date' in details:
                        # Try to extract year if missing
                        pass
                
                scholar_url = link 
            
            has_new_papers = True
            new_paper_titles.append(title)
            
            detected_role = analyze_author_role(authors_list)
            is_featured = detected_role in ['first', 'corresponding', 'co-first']
            
            new_pub_entry = {
                "id": pub_id,
                "title": title,
                "authors": authors_list,
                "venue": venue,
                "year": year,
                "date": "",  # Empty for manual entry
                "abstract": abstract,
                "tags": [],
                "citations": citations,
                "featured": is_featured,
                "author_status": detected_role,
                "links": {"pdf": link},
                "scholar_url": scholar_url
            }
        
        publications_data.append(new_pub_entry)
        
        # Group for Yearly Summary
        if year not in papers_by_year:
            papers_by_year[year] = []
        papers_by_year[year].append(new_pub_entry)

    # Generate Yearly Summaries
    publication_news = []
    current_date = datetime.now().date()

    for year, papers in papers_by_year.items():
        # 1. Timing Check: Skip current year if not yet Dec 31
        if year > current_date.year:
            continue
        if year == current_date.year and current_date < datetime(year, 12, 31).date():
            continue

        # 2. Existence Check
        existing_summary = next((item for item in existing_news if item.get('date') == f"{year}-12" and item.get('category') == 'publication'), None)
        
        if existing_summary:
            publication_news.append(existing_summary)
            continue

        # 3. Generate New Summary
        title = f"Published {len(papers)} Papers in {year}"
        
        authors_stats = {}
        for p in papers:
            for a in p['authors']:
                if not is_me(a):
                    authors_stats[a] = authors_stats.get(a, 0) + 1
        
        sorted_authors = dict(sorted(authors_stats.items(), key=lambda item: item[1], reverse=True))
        
        _, description = generate_yearly_summary(year, papers, sorted_authors)
        
        news_entry = {
            "date": f"{year}-12",
            "title": title,
            "description": description,
            "category": "publication",
            "link": "/publications",
            "related_paper_id": None
        }
        publication_news.append(news_entry)

    # Combine News
    final_news = career_news + publication_news
    
    # Sort publications by date desc (empty date defaults to year-01-01)
    publications_data.sort(key=lambda x: x.get('date') or f"{x['year']}-01-01", reverse=True)
    
    # Sort news by date desc
    final_news.sort(key=lambda x: x['date'], reverse=True)

    print(f"Saving {len(publications_data)} publications and {len(final_news)} news items.")
    save_json(PUBLICATIONS_FILE, publications_data)
    save_json(NEWS_FILE, final_news)

    # Output Summary for Workflow
    summary = {
        "has_new_papers": has_new_papers,
        "new_paper_titles": new_paper_titles,
        "has_citation_updates": has_citation_updates
    }
    with open('publications_update_summary.json', 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=4)
    
    print(f"Update Summary: {json.dumps(summary)}")

if __name__ == "__main__":
    update_publications()
