#!/usr/bin/python3
arrayOne = [-1, 5, 10, 20, 28, 3]
arrayTwo = [26, 134, 135, 15, 17]

def smallestDifference(arrayOne, arrayTwo):
    arrayOne.sort()
    arrayTwo.sort()
    idxOne = 0
    idxTwo = 0
    current = float("inf")
    smallest = float("inf")
    smallestPair = []

    while idxOne < len(arrayOne) and idxTwo < len(arrayTwo):
        firstNumber = arrayOne[idxOne]
        secondNumber = arrayTwo[idxTwo]
        if firstNumber < secondNumber:
            current = secondNumber - firstNumber
            idxOne += 1
        elif firstNumber > secondNumber:
            current = firstNumber - secondNumber
            idxTwo += 1
        else:
            return [firstNumber, secondNumber]
        
        if smallest > current:
            smallest = current
            smallestPair = [firstNumber, secondNumber]
    return smallestPair


if __name__ == "__main__":
    print(smallestDifference(arrayOne, arrayTwo))
