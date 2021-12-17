#!/usr/bin/python3
'''
    Time: O(nlogn + mlogm)
            We are sorting arrayOne and arrayTwo. Sorting takes O(nLogn)
            time.
    Space: O(1) 
            Nothing is really being done to any memory even though a 
            list is created.
'''
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
        firstNumber = arrayOne[idxOne]
        secondNumber = arrayTwo[idxTwo]
        if firstNumber > secondNumber:
            current = firstNumber - secondNumber
            idxTwo += 1
        elif secondNumber > firstNumber:
            current = secondNumber - firstNumber
            idxOne += 1
        else:
            return [firstNumber, secondNumber]

        if smallest > current:
            smallest = current
            smallestPair = [firstNumber, secondNumber]

    return smallestPair

if __name__ == "__main__":
    print(smallestDifference(arrayOne, arrayTwo))
