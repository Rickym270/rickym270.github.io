#!/usr/bin/python3
array = [-3, -1, 0, 2, 5]

lp = 0
rp = len(array) - 1
squared_array = [0 for _ in array]

def sortedSquaredArray(array):
    for idx in reversed(range(len(array))):
        if abs(array[lp]) > abs(array[rp]):
            squared_array[idx] = array[lp] ** 2
            lp += 1
        else:
            squared_array[idx] = array[rp] ** 2
            rp -= 1
    return sortedSquaredArray

if __name__ == "__main__":
    print(sortedSquaredArray(array))
