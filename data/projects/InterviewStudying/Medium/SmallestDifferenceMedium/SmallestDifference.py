#!/usr/bin/python3

'''
    Space - Time complexity:
        Time: O(N log(N) + M log(M))
            Where N is the length of array N and
                  M is the length of array M
                Since the arrays aren't necessarily the same
                size, this is the complexity.
                We are sorting both arrays so the complexity
                is N log (N) and M log (M)
                Pointer logic is roughly M + N time which 
                doesn't really have an effect on the 
                complexity
        Space: O(1)
            We are sorting the arrays in place so no space
            is used up
'''
arrayOne = [-1, 5, 10, 20, 28, 3]
arrayTwo = [26, 134, 135, 15, 17]

def smallestDifference(arrayOne, arrayTwo):
    # Sort the arrays
    # NOTE: Ask if it's okay to sort in place. 
    arrayOne.sort()
    arrayTwo.sort()
    # Declare pointers
    idxOne = 0
    idxTwo = 0
    # Keep track of smallest difference
    smallest = float("inf")
    # Keep track of current difference
    current = float("inf")
    # Keep track of smallest pair
    smallerPair = []

    # Since we're iterating through two arrays, we have to make 
    #   sure the current indices don't overflow their respective
    #   lists/data structures
    while idxOne < len(arrayOne) and idxTwo < len(arrayTwo):
        firstNum = arrayOne[idxOne]
        secondNum = arrayTwo[idxTwo]

        if firstNum < secondNum:
            # Update current smallest difference and increment
            # idxOne
            current = secondNum - firstNum
            # NOTE: Since first num < secondNum we want to
            #           increment idxOne to lessen the gap
            idxOne += 1
        elif secondNum < firstNum:
            current = firstNum - secondNum
            idxTwo += 1
        else:
            # NOTE: If they're equal to each other, return the 
            #       pair
            return [firstNum, secondNum]

        # TODO: Update the smallest number and pair
        # NOTE: Earlier we set smallest to float("inf"). Since 
        #       smallest is initially set to infinity, this part 
        #       will always run initially
        if smallest > current:
            smallest = current
            smallestPair = [firstNum, secondNum]
    return smallestPair

if __name__ == "__main__":
    print(smallestDifference(arrayOne, arrayTwo))

