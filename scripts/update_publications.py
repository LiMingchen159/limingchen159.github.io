import json
import os
import re
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
    Generate a yearly summary using AI.
    """
    if not client:
        return f"In {year}, I published {len(papers)} papers.", f"Research covered various topics. Collaborated with {', '.join(list(authors_stats.keys())[:3])} and others."

    paper_titles = [p['title'] for p in papers]
    co_authors = list(authors_stats.keys())
    
    prompt = f"""
    Write a short, engaging yearly research summary for my personal website news section.
    
    Year: {year}
    Number of Publications: {len(papers)}
    Paper Titles: {', '.join(paper_titles)}
    Co-authors: {', '.join(co_authors)}
    
    Requirements:
    1. Title: "Yearly Research Summary: [Year]" or something similar but catchy.
    2. Description: 2-3 sentences summarizing the key research themes of the year and explicitly thanking key collaborators.
    
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
        return f"Research Summary {year}", f"Published {len(papers)} papers in {year}."

def update_publications():
    print(f"Fetching data for author ID: {AUTHOR_ID}")
    
    existing_publications = {p['id']: p for p in load_json(PUBLICATIONS_FILE)}
    existing_news = load_json(NEWS_FILE)
    
    # ... (news filtering logic remains same) ...
    career_news = []
    for item in existing_news:
        if not item.get('related_paper_id') and item.get('category') != 'publication':
            if 'category' not in item:
                item['category'] = 'career'
            career_news.append(item)
            
    try:
        author = scholarly.search_author_id(AUTHOR_ID)
        scholarly.fill(author, sections=['publications'])
    except Exception as e:
        print(f"Error fetching author data: {e}")
        return

    publications_data = []
    papers_by_year = {}
    
    print(f"Found {len(author['publications'])} publications.")

    # Track changes
    has_new_papers = False
    has_citation_updates = False
    new_paper_titles = []

    for pub in author['publications']:
        title = pub['bib']['title'].strip()
        print(f"Processing: {title}")
        
        try:
            scholarly.fill(pub)
        except Exception as e:
            print(f"Error filling publication '{title}': {e}")
            continue

        year = int(pub['bib'].get('pub_year', datetime.now().year))
        venue = pub['bib'].get('venue', pub['bib'].get('journal', 'Unknown Venue'))
        abstract = pub['bib'].get('abstract', '')
        authors_str = pub['bib'].get('author', 'Mingchen Li')
        authors_list = [a.strip() for a in authors_str.replace(' and ', ',').split(',')]
        
        if ' and ' in authors_str:
             authors_list = authors_str.split(' and ')

        pub_id = generate_id(title, year)
        
        # --- Hybrid Preservation Logic ---
        # If the ID already exists, ONLY update citations, preserve everything else
        if pub_id in existing_publications:
            existing_entry = existing_publications[pub_id]
            current_citations = pub.get('num_citations', 0)
            if existing_entry.get('citations', 0) != current_citations:
                existing_entry['citations'] = current_citations
                has_citation_updates = True
                print(f"  ID exists - Citations updated: {existing_entry.get('citations', 0)} -> {current_citations}")
            else:
                print(f"  ID exists - No changes.")
            new_pub_entry = existing_entry
        else:
            # NEW PUBLICATION - Create entry with empty date for manual entry
            print(f"  New publication - Creating entry (date needs manual entry)")
            has_new_papers = True
            new_paper_titles.append(title)
            
            # Create full entry for new publication
            detected_role = analyze_author_role(authors_list)
            is_featured = detected_role in ['first', 'corresponding', 'co-first']
            
            # Generate Scholar detail URL for manual date lookup
            cites_id = pub.get('cites_id', [''])[0] if isinstance(pub.get('cites_id'), list) else pub.get('cites_id', '')
            scholar_url = f"https://scholar.google.com/citations?view_op=view_citation&hl=en&user={AUTHOR_ID}&citation_for_view={AUTHOR_ID}:{cites_id}" if cites_id else ""
            
            if scholar_url:
                print(f"  Scholar URL: {scholar_url}")
                print(f"  Please manually add 'date' field in format YYYY-MM-DD")
            
            new_pub_entry = {
                "id": pub_id,
                "title": title,
                "authors": authors_list,
                "venue": venue,
                "year": year,
                "date": "",  # Empty for manual entry
                "abstract": abstract,
                "tags": [],
                "citations": pub.get('num_citations', 0),
                "featured": is_featured,
                "author_status": detected_role,
                "links": {"pdf": pub.get('pub_url', '')},
                "scholar_url": scholar_url  # Add URL for reference
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
        if year == current_date.year and current_date < datetime(year, 12, 31).date():
            print(f"Skipping summary for {year} until Dec 31.")
            continue

        # 2. Existence Check
        existing_summary = next((item for item in existing_news if item.get('date') == f"{year}-12" and item.get('category') == 'publication'), None)
        
        if existing_summary:
            print(f"Using existing summary for {year}")
            publication_news.append(existing_summary)
            continue

        # 3. Generate New Summary
        # Title format: "Published {count} Papers in {year}"
        title = f"Published {len(papers)} Papers in {year}"
        
        # Collect co-authors for this year
        authors_stats = {}
        for p in papers:
            for a in p['authors']:
                if not is_me(a):
                    authors_stats[a] = authors_stats.get(a, 0) + 1
        
        # Sort co-authors by frequency
        sorted_authors = dict(sorted(authors_stats.items(), key=lambda item: item[1], reverse=True))
        
        # Generate description only
        _, description = generate_yearly_summary(year, papers, sorted_authors)
        
        news_entry = {
            "date": f"{year}-12", # End of year summary
            "title": title,
            "description": description,
            "category": "publication",
            "link": "/publications", # Link to publications page
            "related_paper_id": None # No single paper
        }
        publication_news.append(news_entry)
        # If we generated a new summary, that counts as new content (similar to new papers)
        # But for now, let's treat it as just news update. 
        # If the user wants PR for news, we might need to flag it. 
        # Assuming news update is fine to commit directly unless it's a new paper.
        # Actually, let's flag it as citation update (safe to commit) or maybe just let it be.
        # The requirement was "if new paper -> PR". 
        # "if only citation -> no PR".
        # Yearly summary is rare (once a year). Let's treat it as safe to commit if no new papers.

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
