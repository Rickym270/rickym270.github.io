#!/usr/bin/python3

def counting_triangles(tri_list):
    # TODO: Define a set to represent the counter
    counter = set()

    # TODO: Iterate through tri_list
    for tri in tri_list:
        # TODO: Add a sorted tuple to counter
        counter.add(tuple(sorted(tri)))
    return len(counter)
