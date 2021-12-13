#!/usr/bin/python3
'''
    Time:
    Runs at O(NlogN) + O(MlogM) time because we are sorting two
    arrays
    Space:
    Uses O(1) space
'''
def smallestDifference(arrayOne, arrayTwo):
    arrayOne.sort()
    arrayTwo.sort()
    idxOne = 0
    idxTwo = 0
    smallest = float("inf")
    current = float("inf")
    smallestPair = []

    while idxOne < len(arrayOne) and idxTwo < len(arrayTwo):
        firstNumber = arrayOne[idxOne]
        secondNumber = arrayTwo[idxTwo]

        if firstNumber < secondNumber:
            current = secondNumber - firstNumber
            idxOne += 1
        elif secondNumber < firstNumber:
            current = firstNumber - secondNumber
            idxTwo += 1
        else:
            return [firstNumber, secondNumber]

        if smallest > current:
            smallest = current
            smallestPair = [firstNumber, secondNumber]
    return smallestPair

