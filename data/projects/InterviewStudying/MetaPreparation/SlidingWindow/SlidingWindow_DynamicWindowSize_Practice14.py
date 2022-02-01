'''
    DYNAMIC SIZED WINDOW
    https://www.youtube.com/watch?v=MK-NZ4hN7rs
    
    Print out smallest subarray size, such that value is >= 8
    [4, 2, 1, 7, 8, 1, 2, 8, 1, 0], targetSum = 8

    Returns 1
'''


def findMaxSumSubarray(array, targetSum):
    windowStart = 0
    currentSum = 0
    smallestSubarraySize = float("inf")

    for windowEnd in range(len(array)):
        currentSum += array[windowEnd]
        # TODO: Calculate the minimum
        smallestSubarraySize = min(smallestSubarraySize, windowEnd - windowStart + 1)
        currentSum -= array[windowStart]
        windowStart += 1
    return smallestSubarraySize


if __name__ == "__main__":
    print(findMaxSumSubarray([4, 2, 1, 7, 8, 1, 2, 8, 1, 0], 8))
