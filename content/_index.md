---
# Leave the homepage title empty to use the site title
title: ""
date: 2022-10-24
type: landing

design:
  # Default section spacing
  spacing: "6rem"

sections:
  - block: resume-biography-3
    content:
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
      text: ""
      # Show a call-to-action button under your biography? (optional)
      button:
        text: Download CV
        url: uploads/CV-EN-Mingchen Li.pdf
    design:
      css_class: dark
      background:
        color: black
        image:
          # Add your image background to `assets/media/`.
          filename: bg.png
          filters:
            brightness: 1.0
          size: cover
          position: center
          parallax: false
  
  - block: markdown
    content:
      title: '📚 My Research'
      subtitle: ''
      text: |-
       I’m a PHD Student in the Hong Kong University of Science and Technology, specializing in large language models, semantic models, and building performance simulation.

       Currently, I am dedicated to developing "BuildingGPT," an advanced tool aimed at revolutionizing how we approach building performance and intelligence. My work integrates qualitative and quantitative methods to explore the role of science and technology in driving economic growth.

       I’m particularly interested in collaborating with scholars in smart buildings, smart cities, and computer science. Please reach out via email/wechat to connect 😃
       
      
      
      columns: '1'

  - block: markdown
    content:
      title: '📹 Featured Video'
      subtitle: ''
      text: temp1
      
      columns: '2'
  - block: collection
    id: papers
    content:
      title: Featured Publications
      filters:
        folders:
          - publication
        featured_only: true
    design:
      view: article-grid
      columns: 2
  - block: collection
    content:
      title: Recent Publications
      text: ""
      filters:
        folders:
          - publication
        exclude_featured: false
    design:
      view: citation
#  - block: collection
#    id: talks
#    content:
#      title: Recent & Upcoming Talks
#      filters:
#        folders:
#          - event
#    design:
#      view: article-grid
#      columns: 1
#  - block: collection
#    id: news
#    content:
#      title: Recent News
#      subtitle: ''
#      text: ''
#      # Page type to display. E.g. post, talk, publication...
#      page_type: post
#      # Choose how many pages you would like to display (0 = all pages)
#      count: 5
#      # Filter on criteria
#      filters:
#        author: ""
#        category: ""
#        tag: ""
#        exclude_featured: false
#        exclude_future: false
#        exclude_past: false
#        publication_type: ""
#      # Choose how many pages you would like to offset by
#      offset: 0
#      # Page order: descending (desc) or ascending (asc) date.
#      order: desc
#    design:
#      # Choose a layout view
#      view: date-title-summary
#      # Reduce spacing
#      spacing:
#        padding: [0, 0, 0, 0]


---
