'''
    FIXED SIZED WINDOW
    https://www.youtube.com/watch?v=MK-NZ4hN7rsSlidingWindow_FixedWindowSize.py

    Find max sum subarray of a fixed size k
    [4, 2, 1, 7, 8, 1, 2, 8, 1, 0], k=3
     7
    Returns 16
'''
arr = [4, 2, 1, 7, 8, 1, 2, 8, 1, 0]
k = 3


def maxElement(arr, k):
    # TODO: We need to keep track of sum
    currentSum = 0
    maxSum = float('inf')

    # TODO: Iterate through the array
    for window_end in range(len(arr)):
        currentSum += arr[window_end]

        # TODO: Determine if the window is of size k
        if window_end <= k - 1:
            # TODO: Determine the new max sum
            maxSum = max(maxSum, currentSum)
            # TODO: Decrease the left side
            currentSum -= arr[window_end - (k - 1)]
    return maxSum

if __name__ == "__main__":
    print(maxElement(arr, k))
