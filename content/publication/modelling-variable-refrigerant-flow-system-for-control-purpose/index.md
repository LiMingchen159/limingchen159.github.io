---
title: "Modelling variable refrigerant flow system for control purpose"
authors:
- D Wang
- admin
- M Guo
- Q Shi
- C Zheng
- D Li
- S Li
- Z Wang
author_notes:
- "Co-first author"
- "Co-first author"
date: "2023-09-03T14:15:28.407Z"
doi: "https://doi.org/10.1016/j.enbuild.2023.113163"

# Schedule page publish date (NOT publication's date).
publishDate: "2023-09-03T14:15:28.407Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ["article-journal"]

# Publication name and optional abbreviated publication name.
publication: "Energy and Buildings"
publication_short: "Energy and Buildings"

abstract: Variable Refrigerant Flow (VRF) systems are gradually gaining popularity in small and medium-sized commercial and residential buildings owing to their high part-load performance, flexible control, and ease of installation and maintenance. Developing models of VRF systems to predict their performance are important for model-based control, fault diagnostic and detection. There are VRF models published in existing literatures, however those models were developed and validated in different datasets. As a result, the model accuracy cannot be directly compared. To fill this gap, this paper presents a comprehensive review of the existing VRF models, and summarizes the input/output parameters and mathematical formulas of 16 VRF models from literature (referred to as physics-based model). Next, we validate and compare the model accuracy of existing models using the same dataset. Additionally, we develop data-driven models using the state-of-art machine learning algorithms, and compare the model accuracy between existing physics-based models with data-driven models. We find the model proposed by Hu et al. in 2019, which regresses the VRF cooling capacity and COP as a linear combination of indoor and outdoor temperatures times a cubed polynomial function of compressor frequency, is the most accurate physics-based model, with a prediction error of 22.19% in the training dataset and 22.44% in the validation dataset. XGBoost is the most accurate data-driven model, with a prediction error of 19.29% in the training dataset and 22.02% in the validation dataset. The data-driven model is more accurate while the physics-based model is more generalizable. The findings of this study can help researchers to select the proper VRF model for building energy prediction, model-based optimization, and fault diagnostic and detection.

# Summary. An optional shortened abstract.
#summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis posuere tellus ac convallis placerat. Proin tincidunt magna sed ex sollicitudin condimentum.

tags:
- Building Performance Optimization
featured: false

# links:
# - name: ""
#   url: ""
url_pdf: 'https://www.sciencedirect.com/science/article/abs/pii/S0378778823003936'
url_code: ''
url_dataset: ''
url_poster: ''
url_project: ''
url_slides: ''
url_source: ''
url_video: ''

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/jdD8gXaTZsc)'
  focal_point: ""
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects: []

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
#slides: example
---

