#!/usr/bin/python3
'''
    Return an array that is sorted and contains the squares of the
    original array
'''
array = [-5,-3,-2,0,1,4]

def sortedSquaredArray(array):
    lp = 0
    rp = len(array) - 1
    squared_array = [ 0 for _ in array ]

    for idx in reversed(range(len(array))):
        if abs(array[lp]) > abs(array[rp]):
            squared_array[idx] = array[lp]**2
            lp += 1
        else:
            squared_array[idx] = array[rp] ** 2
            rp -= 1
    return squared_array

if __name__ == "__main__":
    print(sortedSquaredArray(array))

