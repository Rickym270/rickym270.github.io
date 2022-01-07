'''
    FIXED SIZED WINDOW
    https://www.youtube.com/watch?v=MK-NZ4hN7rsSlidingWindow_FixedWindowSize.py

    Find max sum subarray of a fixed size k
    [4, 2, 1, 7, 8, 1, 2, 8, 1, 0], k=3

    Returns 16
'''

def findMaxSumSubarray(array, k):
    # TODO: Define variables
    maxValue = float("-inf")
    currentRunningSum = 0       # NOTE: This is because we want this to start off 'neutral'

    for i in range(len(array)):
        # TODO: Grow initial window length
        #   TODO: Add current value to currentRunningSum
        currentRunningSum += array[i]
        # NOTE: Is the current running sum greater than the current value?
        if i >= k - 1:
            # WHY?
            #   i denotes the current element
            #   k denotes the total elements we want. Since k = 3, k - 1 = 2 which in terms of array idxs, this denotes
            #       that we have 3 items.
            # TODO: Now that we have 3 elements, compare the currentRunningSum to the max value
            maxValue = max(maxValue, currentRunningSum)
            # TODO: Subtract last element from currentRunningSum to keep the currentRunningSum correlated to array size
            #       k (3)
            currentRunningSum -= array[i - (k - 1)]
    return maxValue

if __name__ == "__main__":
    print(findMaxSumSubarray([4, 2, 1, 7, 8, 1, 2, 8, 1, 0], 3))
