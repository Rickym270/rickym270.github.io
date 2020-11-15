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
	# TODO: Check if a file object passed
        import io
        if type(fobj) == io.TextIOWrapper:
            pass
        else:
            raise InvalidFileObject("Expected io.TextIOWrapper but received {}".format(type(fobj)))
	
	self.lines = getLines(fobj)

    def __getLines(self, f):
	return f.readlines()

    def getLines(self, f):
	return __getLines(f)

    def html(awlf):
	'''
	    Convert self.lines to HTML
	'''
       
