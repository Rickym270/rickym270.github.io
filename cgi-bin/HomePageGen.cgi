#!/usr/bin/python3
'''
    Purpose: Generate Homepage for new entries
             rickym270.github.io
    Notes: This mostly updates the github section of the homepage
'''
import jinja2
import cgi
import cgitb
import os
from datetime import datetime
from github import Github

repo_list = []
cgitb.enable()


debug_list = []
apikey = ""
entries = []


def set_env_vars(template_dir, template, git_cred):
    global apikey
    TEMPLATE_PATH = template_dir
    TEMPLATE = template
    templates = jinja2.Environment(loader=jinja2.FileSystemLoader(searchpath=TEMPLATE_PATH))
    
    print("Content-Type: text/html\r\n\r\n")
    template = templates.get_template(TEMPLATE)

    with open(git_cred, 'r') as f:
        for ind, line in enumerate(f.readlines()):
            apikey = line.strip()

def git_login():
    g = None
    
    if apikey:
        g = Github(apikey)
    else:
        print("API Key is not present")
    return g

def get_git_commits(git):
    user = git.get_user()
    login_user=user.login

    if login_user=="Rickym270":
        pass
    else:
        print("{} is not authorized to use this application".format(login_user))
    
    print("USER events: {}".format(user.get_events()._PaginatedList__list_item))
    print("USER events methods: {}".format(dir(user.get_events())))
    
    for repo in user.get_repos():
        print("Got {}".format(str(repo.get_stats_commit_activity().__getitem__)))5
        print("Got {}".format(dir(repo.get_stats_commit_activity())))



if __name__ == "__main__":
    set_env_vars("../templates/", "home.html", "../etc/githubcred.conf")
    git = git_login()
    get_git_commits(git)
    
    #print(template.render(entries=entries))
    print("Done.\n\n\n")
    
