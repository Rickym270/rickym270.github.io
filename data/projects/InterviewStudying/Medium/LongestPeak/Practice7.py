#!/usr/bin/python3
array = [1, 2, 3, 3, 4, 0, 10, 6, 5, -1, -3, 2, 3]

def longestPeak(array):
    longestPeakLength = 0
    i = 1

    while i < len(array):
        isPeak = array[i-1] < array[i] and array[i] < array[i+1]
        if not isPeak:
            i += 1
            continue

        # TODO: Check left
        leftIdx = i - 2
        while leftIdx >= 0 and array[i] > array[i-1]:
            leftIdx -= 1

        rightIdx = i + 2
        while rightIdx < len(array) and array[i] > array[i+1]:
            rightIdx -= 1

        currentPeakLength = rightIdx - leftIdx - 1
        longestPeakLength = max(longestPeakLength, currentPeakLength)
        i = rightIdx

if __name__ == "__main__":
    print(longestPeak(array))
