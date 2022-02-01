'''
    DYNAMIC SIZED WINDOW
    https://www.youtube.com/watch?v=MK-NZ4hN7rs
    
    Print out smallest subarray size, such that value is >= 8
    [4, 2, 1, 7, 8, 1, 2, 8, 1, 0], targetSum = 8

    Returns 1
'''


def findMaxSumSubarray(array, targetSum):
    smallest_size = float("inf")
    current_sum = 0
    window_start = 0

    for window_end in range(len(array)):
        current_sum += array[window_end]
        smallest_size = min(smallest_size, window_end - window_start + 1)
        current_sum -= array[window_start]
        window_start += 1

    return smallest_size


if __name__ == "__main__":
    print(findMaxSumSubarray([4, 2, 1, 7, 8, 1, 2, 8, 1, 0], 8))
