#!/usr/bin/python3
'''
    Time: O(N) where n is the length of the array
            We are visiting every index
    Space: O(1) space because nothing is created
'''

array = [2, 1, 2, 2, 4, 5, 6]
toMove = 2

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
