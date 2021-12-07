#!/usr/bin/python3

array = [1, 2, 3, 5, 6, 8, 9]
# Expected: [1,4,0,25,36, 64, 81]

def sortedSquaredArray(array):
    lp = 0
    rp = len(array) - 1
    sorted_array = [0 for _ in array]

    for idx in reversed(range(len(array))):
        if abs(array[lp]) > abs(array[rp]):
            sorted_array[idx] = array[lp] ** 2
            lp += 1
        else:
            sorted_array[idx] = array[rp] ** 2
            rp -=1

    return sorted_array

if __name__ == "__main__":
    print(sortedSquaredArray(array))
