'''
    DYNAMIC SIZED WINDOW
    https://www.youtube.com/watch?v=MK-NZ4hN7rs
    
    Print out smallest subarray size, such that value is >= 8
    [4, 2, 1, 7, 8, 1, 2, 8, 1, 0], targetSum = 8

    Returns 1
'''

def findMaxSumSubarray(array, targetSum):
    # NOTE: We need another index that can increase and decrease in size,
    # TODO: Create windowsStart
    # TODO: Create currentRunningSum to keep track of sum of current window
    windowStart = 0
    currentWindowSum = 0
    # TODO: Create a minWindowSize = float("inf") because we are trying to minimize it
    minWindowSize = float("inf")
    for windowEnd in range(len(array)):
        # NOTE: Current window sum is gonna get the number at the current index
        currentWindowSum += array[windowEnd]
        # TODO: If currentWindowSum is greater than the targetSum
        while currentWindowSum >= targetSum:
            # TODO: Record best at the current
            #       We are comparing the current minWindowSize to the size (delta) of the current window
            minWindowSize = min(minWindowSize, windowEnd - windowStart + 1)
            # TODO: Shrink the window size from the left
            currentWindowSum -= array[windowStart]
            # TODO: Increment the location
            windowStart += 1
    return minWindowSize

if __name__ == "__main__":
    print(findMaxSumSubarray([4, 2, 1, 7, 8, 1, 2, 8, 1, 0], 8))
