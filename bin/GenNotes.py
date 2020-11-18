#!/usr/bin/python3
'''
    Generate HTML based on the file given. Essentially building my own parser

    Usage: 
        ./GenNotes.py --src_file=<path> --dest_file=<path>
    Notes:
        - v0.5 Generating from my notes, later I want to incorporate GenHtml.py
'''
import sys
import os.path
from os import path

sys.path.append("../lib")
from ConvertTo import ConvertTo

sys.path.append("exceptions")
from Exceptions import InvalidCommandFormat
from Exceptions import UnknownPath

#NOTE: Initialize
options = []
specifiers = []
generated_html = ""

#NOTE: Is the proper command executed?
args = sys.argv[1:]
print("Arguments: {}".format(args))
if not args or len(args)<3:
    raise InvalidCommandFormat('type="<Docs|Projects>", src_file=<path> and dest_file=<path> options needed')

#NOTE: Extract options and specifiers
for arg in args:
    option, specifier = arg.split("=")
    options.append(option)
    specifiers.append(specifier)

#NOTE: Executed correctly?
if 'type' not in options or 'src_file' not in options or 'dest_file' not in options:
    raise InvalidCommandFormat('type, src_file and dest_file needed together')

#TODO: Does the SOURCE path exist?
type = specifiers[0]
print("TYPE: {}".format(type))
src = specifiers[1]
dest = specifiers[2]
lines = []
if path.exists(src):
    with open(src, "r") as f:
        cvt = ConvertTo(type,f)
        generated_html = cvt.html()
        #print("Lines: {}".format(lines))
else:
    raise UnknownPath("Src Path {} is not a real/valid location".format(src))

#NOTE: If DESTINATION path specified doesn't exist, create it.
#      Run with open with w+ specifier
try:
    with open(dest, "w+") as f:
        f.write(generated_html)
except Exception as e:
    raise UnknownPath("Unable to write at dest path {}:\n\t{}".format(dest, e))


