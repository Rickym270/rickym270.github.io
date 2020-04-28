#!/usr/local/bin/python3

import jinja2
import cgi
import cgitb
import os
from datetime import datetime

cgitb.enable()

TEMPLATE_PATH = "../templates/"
FAQPAGES_PATH = "../data/FAQPages/"
TEMPLATE = "doc.html"

debug_list = []
templates = jinja2.Environment(loader=jinja2.FileSystemLoader(searchpath=TEMPLATE_PATH))
print("Content-Type: text/html\r\n\r\n")

for pagename in os.listdir(FAQPAGES_PATH):
    gen_pagename = pagename.split(".")[0]
    GEN_HTMLNAME = "{}.html".format(gen_pagename)

    title = ""
    content = ""
   
    with open("{}{}".format(FAQPAGES_PATH, pagename)) as f:
        if pagename.split(".")[1] == "txt":
            lines = f.readlines()
            for line in lines:
                section_key = line.split(":")[0].strip()
                content = line.split(":")[1].strip()
                if section_key == "title":
                    title = content
                    print("TITLE: {}".format(content))
                if section_key == "body":
                    file_content = content
                    print("CONTENT: {}".format(content))
        else:
            print("Invalid filetype")
            continue
    
    # Start
    template = templates.get_template(TEMPLATE)
    #template.render(debug_list=debug_list, timestamp=timestamp, repo_list=repo_list)
    with open("../html/pages/FAQPages/{}".format(GEN_HTMLNAME), "w+") as f:
        f.write(template.render(debug_list=debug_list, title=title, content=content))

print("Done.\n\n\n")
