#!/usr/bin/python3

def sortedSquaredArray(array):
    squared_array = [ 0 for _ in array ]
    lp = 0
    rp = len(array) - 1

    for idx in reversed(range(len(array))):
        if abs(array[lp]) > abs(array[rp]):
            squared_array[idx] = array[lp] ** 2
            lp += 1
        else:
            squared_array[idx] = array[rp] ** 2
            rp -= 1
    return squared_array

if __name__ == "__main__":
    print(sortedSquaredArray([-5,0,1,6,11]))
