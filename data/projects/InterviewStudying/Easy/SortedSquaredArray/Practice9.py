#!/usr/bin/python3

array = [-7, -3, 1, 9, 22, 30]

def sortedSquaredArray(array):
    lp = 0
    rp = len(array) - 1
    squared_array = [ 0 for _ in array ]

    for idx in reversed(range(len(array))):
        if abs(array[lp]) > abs(array[rp]):
            squared_array[idx] = array[lp] ** 2
            lp += 1
        else:
            squared_array[idx] = array[rp] ** 2
            rp -= 1

    return squared_array

if __name__ == "__main__":
    print(sortedSquaredArray(array))
