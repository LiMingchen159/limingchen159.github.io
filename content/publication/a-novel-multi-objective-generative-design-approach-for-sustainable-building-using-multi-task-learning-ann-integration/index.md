---
title: "A novel multi-objective generative design approach for sustainable building using multi-task learning (ANN) integration"
authors:
  - admin
  - Zhe Wang
  - Hao Chang
  - Zhoupeng Wang
  - and Juanli Guo
author_notes:
- "First author"
date: "2024-09-20T11:18:20.089Z"
doi: "https://doi.org/10.1016/j.apenergy.2024.124220"

# Schedule page publish date (NOT publication's date).
publishDate: "2024-08-20"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ["article-journal"]

# Publication name and optional abbreviated publication name.
publication: "Applied Energy"
publication_short: "AE"

abstract: Building Performance Optimization (BPO) plays a pivotal role in   enhancing building performance, guaranteeing comfort while reducing resource   consumption. Existing performance-driven generative design is computational   demanding and difficult to be generalized to other similar buildings with   difficult to be generalized to other building types or climate conditions. To   fill this gap, this paper introduces a novel framework, which integrates   multitask learning (MTL), code compliance check, and multi-objective   optimization through NSGA-III algorithm. This framework is able to identify   Paratoo Optimal design solutions, which comply with building codes, at low   computation costs. The framework begins with selecting key design variables   that are critical to building energy, comfort performance and life cycle cost.   It then employs MTL to enhance the model's accuracy while reducing   computational costs. Next, we designed a code compliance checking module   followed by the NSGA-III optimization process, with the objective of   identifying solutions that comply with existing building codes. The results   indicate that the proposed MTL network achieved an R2 score of 0.983–0.993 on   the test set. In the particular case study where equal weights are preferred,   this approach yielded noteworthy reductions of 27.65%, 19.55%, and 31.13% in   Building Energy Consumption (BEC), Life Cycle Cost (LCC), and Residue of   continuous Daylight Autonomy (RcDA), respectively, for a rural dwelling, and   exclude solutions that fail to satisfy regulatory standards. This framework   allows designer to input the weights of each objective based on their   preference and can be applied to other building types and climate regions.   Last, we develop a solution selection tool based on the results output by the   framework we proposed, which can be found at   https://github.com/LiMingchen159/Village-House-Design-Strategy-in-Hebei-Province-China.

# Summary. An optional shortened abstract.
#summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis posuere tellus ac convallis placerat. Proin tincidunt magna sed ex sollicitudin condimentum.

tags:
- Building Performance Optimization
featured: true

# links:
# - name: ""
#   url: ""
url_pdf: ''
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
#projects: []

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
#slides: example
---

{{% callout note %}}
Click the *Cite* button above to demo the feature to enable visitors to import publication metadata into their reference management software.
{{% /callout %}}

{{% callout note %}}
Create your slides in Markdown - click the *Slides* button to check out the example.
{{% /callout %}}

Add the publication's **full text** or **supplementary notes** here. You can use rich formatting such as including [code, math, and images](https://docs.hugoblox.com/content/writing-markdown-latex/).
****