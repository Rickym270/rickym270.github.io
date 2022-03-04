'''
    DYNAMIC SIZED WINDOW
    https://www.youtube.com/watch?v=MK-NZ4hN7rs
    
    Print out smallest subarray size, such that value is >= 8
    [4, 2, 1, 7, 8, 1, 2, 8, 1, 0], targetSum = 8

    Returns 1
'''


def findMaxSumSubarray(array, targetSum):
    windowStart = 0
    currentWindowSum = 0
    smallestWindowSize = float("inf")

    # TODO: Iterate through the array
    for windowEnd in range(len(array)):
        # TODO: Keep track of current sum
        currentWindowSum += array[windowEnd]
        # TODO: Check if current sum is greater than targetSum
        while currentWindowSum >= targetSum:
            # TODO: Calculate min window size by comparing smallestWindowSize
            #           and windowEnd - windowStart + 1
            smallestWindowSize = min(smallestWindowSize, windowEnd - windowStart + 1)
            # TODO: Get current window sum
            currentWindowSum = array[windowStart]
            # TODO: Increment window start
            windowStart += 1
    return smallestWindowSize

if __name__ == "__main__":
    print(findMaxSumSubarray([4, 2, 1, 7, 8, 1, 2, 8, 1, 0], 8))
