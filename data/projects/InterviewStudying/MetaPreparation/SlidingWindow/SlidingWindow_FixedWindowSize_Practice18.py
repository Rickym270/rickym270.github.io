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
    # TODO: Keep track of maxSum, currentSum
    currentSum = 0
    maxSum = float("-inf")

    for i in range(len(arr)):
        currentSum += arr[i]
        if i <= k - 1:
            maxSum = max(maxSum, currentSum)
            currentSum -= arr[ i - (k - 1)]

    return maxSum

if __name__ == "__main__":
    print(maxElement(arr, k))
