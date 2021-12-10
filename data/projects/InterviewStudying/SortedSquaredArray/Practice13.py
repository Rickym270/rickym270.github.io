#!/usr/bin/python3

array = [-9, -5, 0, 1, 4, 8]

def sortedSquaredArray(array):
    array.sort()
    lp = 0
    rp = len(array) - 1
    sorted_squares = [0 for _ in array]

    for idx in reversed(range(len(array))):
        if abs(array[lp]) > abs(array[rp]):
            sorted_squares[idx] = array[lp] ** 2
            lp += 1
        elif abs(array[lp]) < abs(array[rp]):
            sorted_squares[idx] = array[rp] ** 2
            rp -= 1
    return sorted_squares

if __name__ == "__main__":
    print(sortedSquaredArray(array))
