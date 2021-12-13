#!/usr/bin/python3
# O(n) time, O(1) space
array = [-1, -5, -10, -1100, -1100, -1101, -1102, -9001]

def isMonotonic(array):
    # TODO: Perform a check that if the array is less than or
    #       equal to 2, return True
    if len(array) <= 2:
        return True

    # TODO: Determine the direction by subtrating the two numbers
    # NOTE: This is done because if the answer is negative, that
    #       means decreasing. If positive, increasing. If 0, then
    #       it is stagnant
    direction = array[1] - array[0]
    for i in range(2, len(array)):
        # TODO: Check if the direction is meaningful
        # NOTE: We do this by checking if the difference is 
        #       equal to 0
        if direction == 0:
            direction = array[i] - array[i-1]
            continue
        # NOTE: We have something meaninful
        if breaksDirection(direction, array[i - 1], array[i]):
            return False
    return True

def breaksDirection(direction, previousInt, currentInt):
    # TODO: Check whether or not the differnece between the 
    #       currentInt and previousInt is following direction
    difference = currentInt - previousInt
    # NOTE: if difference is positive, the difference respects
    #       the direction
    # NOTE: if difference is negative, the difference does not
    #       respect the direction
    # NOTE: If difference is 0, you can ignore the  
    if direction > 0:
        # NOTE: If direction is greater than 0 and the
        #       difference is less than 0, we are breaking the
        #       direction
        return difference < 0
    # TODO: check for direction is greater than 0
    # NOTE: We don't check if it is equal because if it was, the
    #       condition on line 19 would have already triggered
    return difference > 0


if __name__ == "__main__":
    print(isMonotonic(array))
