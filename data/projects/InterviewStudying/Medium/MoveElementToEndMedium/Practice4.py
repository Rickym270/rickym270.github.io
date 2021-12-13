#!/usr/bin/python3
array = [1, 2, 3, 4, 5]
toMove = 3

#TIME: O(n)
#SPACE: O(1)
def moveElementToEnd(array, toMove):
    lp = 0
    rp = len(array) - 1
    while lp < rp:
        while lp < rp and array[rp] == toMove:
            rp -= 1
        if array[lp] == toMove:
            array[lp], array[rp] = array[rp], array[lp]
        lp += 1
    return array

if __name__ == "__main__":
    print(moveElementToEnd(array, toMove))
