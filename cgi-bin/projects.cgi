#!/usr/bin/python3
'''
    Generates a new version of the projects page based on information received from Github API
    NOTE: PersonalPage env should be activated before running this.
'''
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
        apikey = line.strip()

if apikey:
    g = Github(apikey)
else:
    print("API Key is not present")

for repo in g.get_user().get_repos():
    repo_list[repo.name] = {    'name'          :   repo.name,
                                'description'   :   repo.description,
                                'url'           :   repo.html_url};

import json
with open(JSONPATH, 'r') as f:
    classifiedJSON =  json.load(f)

print("Done.\n\n\n")

# Start
template = templates.get_template(TEMPLATE)
#template.render(debug_list=debug_list, timestamp=timestamp, repo_list=repo_list)
with open("../html/pages/{}".format(GEN_HTMLNAME), "w+") as f:
    f.write(template.render(debug_list=debug_list, timestamp=timestamp, repo_list=repo_list, classJSON = classifiedJSON))

