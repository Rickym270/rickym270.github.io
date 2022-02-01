'''
    DYNAMIC SIZED WINDOW
    https://www.youtube.com/watch?v=MK-NZ4hN7rs
    
    Print out smallest subarray size, such that value is >= 8
    [4, 2, 1, 7, 8, 1, 2, 8, 1, 0], targetSum = 8

    Returns 1
'''
def findMaxSumSubarray(array, targetSum):
    windowStart = 0
    currnetSum = 0
    minSubarraySize = float("inf")

    for windowEnd in range(len(array)):
        currnetSum += array[windowEnd]
        minSubarraySize = min(minSubarraySize, windowEnd - windowStart + 1)
        currnetSum -= array[windowStart]
        windowStart += 1
    return minSubarraySizeSlidingWindow_FixedWindowSize_Practice14.py

if __name__ == "__main__":
    print(findMaxSumSubarray([4, 2, 1, 7, 8, 1, 2, 8, 1, 0], 8))
