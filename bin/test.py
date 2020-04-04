#!/usr/local/bin/python3
import sys
sys.path.append("~/Documents/Dev/Github/rickym270.github.io/bin")
from GenHtml import GenHTML

print("Starting")
GenHTML_obj = GenHTML()
GenHTML_obj.gen_html("/Users/rmartinez/Documents/Dev/GitHub/rickym270.github.io/templates/projects.html")
print("DONE")

