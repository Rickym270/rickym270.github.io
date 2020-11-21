#!/usr/bin/python3
'''
    Author: Ricky Martinez
    Purpose: Just messing around. I wanted to make an express way to convert all my notes into HTML
'''
import sys 
sys.path.append("../bin/exceptions/")
from Exceptions import InvalidFileObject

class ConvertTo(object):
    def __init__(self, doc_type, fobj):
        self.TEMPLATE_DIR = "../templates/"
        #NOTE: Check if doc_type is passed
        supported_types = ["Docs", "Projects"]
        if doc_type in supported_types: pass
        else: raise InvalidDocType("Unable to generate {}".format(doc_type))

        # TODO: Check if a file object passed
        import io
        if type(fobj) == io.TextIOWrapper: pass
        else: raise InvalidFileObject("Expected io.TextIOWrapper but received {}".format(type(fobj)))

        if doc_type == "Docs":
            self.TEMPLATE = "doc.html"
        else:
            self.TEMPLATE = "projects.html"
        self.doc_type = doc_type
        self.lines = fobj.readlines()

    def html(self):
        '''
            Convert self.lines to HTML
        '''
        print("cvt.html running to generate {}".format(self.doc_type))
        import jinja2

        template = jinja2.Environment(loader=jinja2.FileSystemLoader(searchpath=self.TEMPLATE_DIR))
        template = template.get_template(self.TEMPLATE)

        pycode_start = False
        devider = False
        #NOTE: Title has to be first in the line
        title = self.lines[0].strip()
        #NOTE: Body is the rest minus the first line
        body = self.lines[1:]
        for i in range(len(body)):
            #NOTE: Strips whitepsace from end of each line
            body[i] = body[i].rstrip()
            body[i] = body[i].replace("    ", "&nbsp;&nbsp;&nbsp;&nbsp;")
            body[i] = body[i].replace("\n", "</br>")
            body[i] = body[i] + "</br>"

            #NOTE: Interpret '=====' as a divider
            if "=====" in body[i]:
                body[i] = """<div class='divider'></div></br>
                                <h4>{}</h4>""".format(body[i].replace("=","").strip())
                

            if pycode_start:
                body[i] = "<code>{}</code>".format(body[i])
            # NOTE: Define if python code has started
            if '<pycode>' in body[i]:
                pycode_start = True
                #NOTE: Replace <pycode> with <pre>
                body[i] = "<pre>"
            if '</pycode>' in body[i] and pycode_start:
                pycode_start = False
                #NOTE: Replace <pycode> with <pre>
                body[i] = "</pre>"

            #TODO: Add HTML Support

        return template.render(title=title, content=body)


