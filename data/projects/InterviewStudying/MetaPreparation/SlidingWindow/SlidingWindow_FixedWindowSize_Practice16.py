'''
    FIXED SIZED WINDOW
    https://www.youtube.com/watch?v=MK-NZ4hN7rsSlidingWindow_FixedWindowSize.py

    Find max sum subarray of a fixed size k
    [-1, 2, 3, 1, -3, 2], k = 2
'''
'''
    Give an array arr[] of N integers and another integer k ≤ N. The task is to find the maximum element of every sub-array of size k.
'''
arr = [9, 7, 2, 4, 6, 8, 2, 1, 5]
k = 3


def maxElement(arr, k):
    n = len(arr)
    max_integers = [0 for _ in range(n)]
    stack = [0]

    for i in range(1, n):
        while len(stack) > 0 and arr[stack[-1]] < arr[i]:
            max_integers[stack[-1]] = i - 1
            del stack[-1]

        stack.append(i)

    return max_integers


if __name__ == "__main__":
    print(maxElement(arr, k))
