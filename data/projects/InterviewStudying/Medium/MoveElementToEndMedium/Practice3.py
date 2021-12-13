#!/usr/bin/python3
# Time: O(n)
# Space: 0(1)
array = [2, 1, 2, 2, 2, 3, 4, 2]
toMove = 2

def moveElementToEnd(array):
    lp = 0
    rp = len(array) -1

    while lp < rp:
        while lp < rp and array[rp] == toMove:
            rp -= 1
        if array[lp] == toMove:
            array[lp], array[rp] = array[rp], array[lp]
        lp += 1
    return array

if __name__ == "__main__":
    print(moveElementToEnd(array))
