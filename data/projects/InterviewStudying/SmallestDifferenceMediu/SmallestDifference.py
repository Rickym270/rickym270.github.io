#!/usr/bin/python3

arrayOne = [-1, 5, 10, 20, 28, 3]
arrayTwo = [26, 134, 135, 15, 17]

def smallestDifference(arrayOne, arrayTwo):
    arrayOne.sort()
    arrayTwo.sort()
    idxOne = 0
    idxTwo = 0
    smallest = float("inf")
    current = float("inf")
    smallestPair = []

    while idxOne < len(arrayOne) and idxTwo < len(arrayTwo):
        firstNum = arrayOne[idxOne]
        secondNum = arrayTwo[idxTwo]

        if firstNum < secondNum:
            smallestDiff.append([array[i], array[lp])
        if abs(array[i] - array[rp]) == 0:
                smallestDiff.append([array[i], array[lp])



if __name__ == "__main__":
    print(smallestDifference(arrayOne, arrayTwo))

'''
    Summary:
        We want to iterate through both lists. We can do this by 
'''

