#!/usr/bin/python3

def seatingArrangements(arr):
    # TODO: Return total awkwardness
    awkwardness = 0
    # TODO: Sort
    arr.sort()

    # TODO: Iterate through the array to find the awkwardness
    for i in range(len(arr) - 2):
        # TODO: Calculate current awkwardness
        current_awkwardness = arr[i + 2] - arr[i]
        # TODO: Get max awkwardness
        awkwardness = max(awkwardness, current_awkwardness)

    return awkwardness