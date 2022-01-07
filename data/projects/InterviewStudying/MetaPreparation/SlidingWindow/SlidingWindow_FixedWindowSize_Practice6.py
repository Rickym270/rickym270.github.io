'''
    FIXED SIZED WINDOW
    https://www.youtube.com/watch?v=MK-NZ4hN7rsSlidingWindow_FixedWindowSize.py

    Find max sum subarray of a fixed size k
    [4, 2, 1, 7, 8, 1, 2, 8, 1, 0], k=3

    Returns 16
'''

def findMaxSumSubarray(array, k):
    maxSum = float("-inf")
    currentRunningSum = 0

    for i in range(len(array)):
        currentRunningSum += array[i]
        if i >= k - 1:
            maxSum = max(maxSum, currentRunningSum)
            currentRunningSum -= array[ i - (k-1)]
    return maxSum


if __name__ == "__main__":
    print(findMaxSumSubarray([4, 2, 1, 7, 8, 1, 2, 8, 1, 0], 3))
