#!/usr/bin/python3
class GEN_ERROR(Exception):
    def __init__(self, message):
        self.message =  message
    def __str__(self):
        return self.message

class GenHTML(object):
    j2 = __import__('jinja2')
    def __init__(self):
        print("Name: {}".format(__name__))
        self.HTMLName = None
        self.JVARS = None
        self.TEMPLATE_PATH = None
        self.TEMPLATE_NAME = None

    def set_variables(self, jvars = None):
        if not jvars:
            # NOTE: Nothing to set for jinja vars
            return
        else:
            self.JVARS = jvars

    def set_template_path(self, template_path=None):
        if not template_path:
            self.TEMPLATE_PATH = "../templates/"
        else:
            self.TEMPLATE_PATH = template_path

    def set_template(self, template_name):
        # NOTE: REQUIRED
        self.TEMPLATE = template_name

    def set_HTMLTitle(self, HTMLTitle):
        self.TEMPLATE_NAME = HTMLTitle
        self.JVARS = {HTMLTitle}

    def get_jEnvironment(self):
        return self.j2.Environment(loader=self.j2.PackageLoader("rickym270.github.io", "templates"))

    def gen_html(self, html_title):
        self.set_HTMLTitle(html_title)
        self.set_template_path()

        templates = self.get_jEnvironment()
        print("Content-Type: text/html\r\n\r\n")

        if not self.TEMPLATE_NAME:
            raise GEN_ERROR("Unable to generate HTNL. No template name specified")

        template = templates.get_template(self.TEMPLATE_NAME)

        with open(self.TEMPLATE_NAME, "w+") as f:
            f.write(template.render(self.JVARS))


