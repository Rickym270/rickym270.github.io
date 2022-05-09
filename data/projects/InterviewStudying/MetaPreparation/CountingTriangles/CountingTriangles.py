#!/usr/bin/python3

def counting_triangles(tri_list):
    # TODO: Create a set since this doesn't allow for duplicates
    counter = set()
    # TODO: Iterate through triangle list
    for tri in tri_list:
        # TODO: Append to counter as a sorted tuple
        counter.add(tuple(sorted(tri)))
    # TODO: Return length of counter
    return len(counter)
