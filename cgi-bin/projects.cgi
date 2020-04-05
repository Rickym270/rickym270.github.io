#!/usr/local/bin/python3

import jinja2
import cgi
import cgitb
from datetime import datetime

cgitb.enable()

TEMPLATE_PATH = "../templates/"
TEMPLATE = "projects.html"
GEN_HTMLNAME = "projects_test.html"

templates = jinja2.Environment(loader=jinja2.FileSystemLoader(searchpath=TEMPLATE_PATH))
print("Content-Type: text/html\r\n\r\n")

debug_list = []
timestamp = datetime.now()
debug_list.append(timestamp)

# Start
template = templates.get_template(TEMPLATE)
with open("../pages/{}".format(GEN_HTMLNAME), "w+") as f:
    f.write(template.render(debug_list=debug_list, timestamp=timestamp))

