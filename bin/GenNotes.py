#!/usr/local/bin/python3
import sys
o_Notes = '../data/RawFAQPages/'

args = sys.argv[1:]
print("Arguments: {}".format(args))

class InvalidCommandFormat(Exception):
    pass

#if '--src_file' in args:

if '--out_file' in args and '--src_file' not in args:
    raise InvalidCommandFormat('TESTING')

