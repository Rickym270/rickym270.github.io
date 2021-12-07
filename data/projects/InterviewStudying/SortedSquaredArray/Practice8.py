#!/usr/bin/python3

array = [-7, -3, 1, 9, 22, 30]

def sortedSquaredArray(array):
    sorted_array = [ 0 for _ in array ]
    lp = 0
    rp = len(array) - 1

    for idx in reversed(range(len(array))):
        if abs(array[lp]) > abs(array[rp]):
            sorted_array[idx] = array[lp] ** 2
            lp += 1
        else: 
            sorted_array[idx] = array[rp] ** 2
            rp -= 1
    return sorted_array

if __name__ == "__main__":
    print(sortedSquaredArray(array))
