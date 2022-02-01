'''
    DYNAMIC SIZED WINDOW
    https://www.youtube.com/watch?v=MK-NZ4hN7rs
    
    Print out smallest subarray size, such that value is >= 8
    [4, 2, 1, 7, 8, 1, 2, 8, 1, 0], targetSum = 8

    Returns 1
'''
def findMaxSumSubarray(array, targetSum):
    windowStart = 0
    currentSubArraySum = 0
    smallestSubArraySize = float("inf")

    for windowEnd in range(len(array)):
        currentSubArraySum += array[windowEnd]
        smallestSubArraySize = min(smallestSubArraySize, windowEnd - windowStart + 1)
        currentSubArraySum -= array[windowStart]
        windowStart += 1

    return smallestSubArraySize

if __name__ == "__main__":
    print(findMaxSumSubarray([4, 2, 1, 7, 8, 1, 2, 8, 1, 0], 8))
