#!/usr/bin/python3
'''
    Author: Ricky Martinez
    Purpose: Just messing around. I wanted to make an express way to convert all my notes into HTML
'''
import sys 
sys.path.append("../bin/exceptions/")
from Exceptions import InvalidFileObject

class ConvertTo(object):
    def __init__(self, fobj):
        self.TEMPLATE = "../templates/doc.html"
        self.TEMPLATE_DIR = "../templates/"
        # TODO: Check if a file object passed
        import io
        if type(fobj) == io.TextIOWrapper:
            pass
        else:
            raise InvalidFileObject("Expected io.TextIOWrapper but received {}".format(type(fobj)))
        
        self.lines = fobj.readlines()

    def html(self):
        '''
            Convert self.lines to HTML
        '''
        print("cvt.html running. Self.lines: {}".format(self.lines))
        pycode_start = False
        title = self.lines[0]
        for i in range(len(self.lines)):
            # NOTE: Define if python code has started
            if '<pycode>' in self.lines[i]:
                pycode_start = True
            if '</pycode>' in self.lines[i] and pycode_start:
                pycode_start = False

        print("Title: {}".format(title))


