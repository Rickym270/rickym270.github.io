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
repo_list = []
timestamp = datetime.now()
debug_list.append(timestamp)

from github import Github
username = ""
pwd = ""

g = Github(username, pwd)

for repo in g.get_user().get_repos():
    repo_list.append({
        'name'          :   repo.name,
        'description'   :   repo.description,
        'url'           :   repo.html_url});

from pprint import pprint
pprint(repo_list)
# Start
#template = templates.get_template(TEMPLATE)
#with open("../pages/{}".format(GEN_HTMLNAME), "w+") as f:
#    f.write(template.render(debug_list=debug_list, timestamp=timestamp))

