#!/usr/bin/python3

arr = [5, 10, 6, 8] # RETURNS 4

def seatingArrangements(arr):
    # returns minimum awkward seating arrangements
    awkwardness = 0
    # TODO: Sort the array
    arr.sort()

    # TODO: Iterate through array
    for i in range(len(arr) - 2):
        # TODO: Get current awkwardness
        current_awkwardness = arr[i+2] - arr[i]
        awkwardness = max(awkwardness, current_awkwardness)

    return awkwardness

if __name__ == "__main__":
    print(seatingArrangements(arr))
