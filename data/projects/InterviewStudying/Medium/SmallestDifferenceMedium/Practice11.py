#!/usr/bin/python3
arrayOne = [-1, 5, 10, 20, 28, 3]
arrayTwo = [26, 134, 135, 15, 17]

def smallestDifference(arrayOne, arrayTwo):
    smallestPair = []
    arrayOne.sort()
    arrayTwo.sort()
    idxOne = 0
    idxTwo = 0
    smallest = float("inf")
    current = float("inf")

    while idxOne < len(arrayOne) and idxTwo < len(arrayTwo):
        firstNum = arrayOne[idxOne]
        secondNum = arrayTwo[idxTwo]
        if firstNum > secondNum:
            current = firstNum - secondNum
            idxTwo += 1
        elif firstNum < secondNum:
            current = secondNum - firstNum
            idxOne += 1
        else:
            return [firstNum, secondNum]

        if smallest > current:
            smallest = current
            smallestPair = [firstNum, secondNum]

    return smallestPair

if __name__ == "__main__":
    print(smallestDifference(arrayOne, arrayTwo))
