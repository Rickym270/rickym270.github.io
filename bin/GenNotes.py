#!/usr/bin/python3
import sys
import os.path
from os import path


sys.path.append("exceptions")
from Exceptions import InvalidCommandFormat
from Exceptions import UnknownPath

args = sys.argv[1:]
print("Arguments: {}".format(args))

if not args or len(args)<2:
    raise InvalidCommandFormat('src_file=<path> and out_file=<path> options needed')

if ('--src_file' in args and '--out_file' not in args) or ('--out_file' in args and '--src_file' not in args):
    raise InvalidCommandFormat('src_file and out_file needed together')

#TODO: Does the path exist?
src = args[0].split("=")[1]
dest = args[1].split("=")[1]
if not path.exists(src):
    raise UnknownPath("Src Path {} is not a real/valid location".format(src))
if not path.exists(dest):
    raise UnknownPath("Out Path {} is not a real/valid location".format(dest))
