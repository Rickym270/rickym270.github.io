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
    minWindowSize = float("inf")

    for windowEnd in range(len(array)):
        currentWindowSum += array[windowEnd]
        while currentWindowSum >= targetSum:
            minWindowSize = min(minWindowSize, windowEnd - windowStart + 1)
            currentWindowSum -= array[windowStart]
            windowStart += 1
    return minWindowSize

if __name__ == "__main__":
    print(findMaxSumSubarray([4, 2, 1, 7, 8, 1, 2, 8, 1, 0], 8))
