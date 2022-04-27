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
    current_sum = 0
    max_sum = float("-inf")

    for i in range(len(arr)):
        current_sum += arr[i]
        if i >= k - 1:
            max_sum = max(max_sum, current_sum)
            current_sum -= arr[i - (k-1)]

    return max_sum

if __name__ == "__main__":
    print(maxElement(arr, k))
