'''
    DYNAMIC SIZED WINDOW + AUXILLARY DS
    Contiguous Subarrays
        You are given an array arr of N integers. For each index i, you are required
        to determine the number of contiguous subarrays that fulfill the following
        conditions:
        The value at index i must be the maximum element in the contiguous subarrays,
        and

        These contiguous subarrays must either start from or end on index i.

'''

def longestDistinctSubstring(array, k):
    # TODO: Since dynamic, create windowStart, frequencyMap, and longestSubarrayString
    window_start = 0
    longest_subarray_string = 0
    frequency_map = {}

    # TODO: Populate frequency_map and iterate through array while len(frequency_map) > k
    for window_end in range(len(array)):
        right_char = array[window_end]
        if right_char not in frequency_map:
            frequency_map[right_char] = 0
        frequency_map[right_char] += 1

        while len(frequency_map) > k:
            # TODO: Keep track of left char
            left_char = array[window_start]
            # TODO: Since we seen left char, reduce it's frequency
            frequency_map[left_char] -= 1
            # TODO: If freuqnecy of char == 0, remove it
            if frequency_map[left_char] == 0:
                frequency_map.pop(left_char, None)
            # TODO: Increment window_start
            window_start += 1
        # TODO: Calculate the max
        longest_subarray_string = max(longest_subarray_string, window_end - window_start + 1)
    # TODO: Return the max
    return longest_subarray_string

if __name__ == "__main__":
    print(longestDistinctSubstring(["A", "A", "A", "H", "H", "I", "B", "C"], 2))
