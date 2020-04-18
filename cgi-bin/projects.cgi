#!/usr/local/bin/python3

import jinja2
import cgi
import cgitb
from datetime import datetime

cgitb.enable()

TEMPLATE_PATH = "../templates/"
TEMPLATE = "projects.html"
GEN_HTMLNAME = "projects.html"
JSONPATH = "../data/ProjectClassification.json"

templates = jinja2.Environment(loader=jinja2.FileSystemLoader(searchpath=TEMPLATE_PATH))
print("Content-Type: text/html\r\n\r\n")

git_user, git_oass = "", ""
debug_list = []
repo_list = {}
classifiedJSON = {}
timestamp = datetime.now()

from github import Github
with open("../etc/githubcred.conf", 'r') as f:
    for ind, line in enumerate(f.readlines()):
        line = line.strip()
        if ind == 0:
            git_user = line
        if ind == 1:
            git_pass = line

g = Github(git_user, git_pass)

for repo in g.get_user().get_repos():
    repo_list[repo.name] = {    'name'          :   repo.name,
                                'description'   :   repo.description,
                                'url'           :   repo.html_url};

import json
with open(JSONPATH, 'r') as f:
    classifiedJSON =  json.load(f)
from pprint import pprint
pprint(repo_list)

# Start
template = templates.get_template(TEMPLATE)
#template.render(debug_list=debug_list, timestamp=timestamp, repo_list=repo_list)
with open("../html/pages/{}".format(GEN_HTMLNAME), "w+") as f:
    f.write(template.render(debug_list=debug_list, timestamp=timestamp, repo_list=repo_list, classJSON = classifiedJSON))

