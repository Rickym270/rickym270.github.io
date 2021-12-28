#!/usr/bin/python3
array = [1, 2, 3, 3, 4, 0, 10, 6, 5, -1, -3, 2, 3]
#NOTE:               P      P
# Time: O(n)
# Space: O(1) 
def longestPeak(array):
    #TODO: Find all peaks
        # NOTE: if you find a number who's greater than the two
        #       adjacent values, then it is a peak 
    #TODO: Find the length of the peaks
        # NOTE: The peaks have been identified so starting at 4
        #       and 10, find out how far you can iterate to the
        #       left and to the right so long as we find integers
        #       that are strictly decreasing.
        #       Once we find integers that are no l onger
        #       decreasing, we've found the edge of the peak
        # NOTE: Once the length of the peak is determined, and
        #       you've found the edge, you can skip to the next
        #       start of peak
    # NOTE: A peak cannot be found on either ends of the array
    i = 1
    # NOTE: Create a variable to store the longest peak
    longestPeak = 0
    # NOTE: We only go up to the penultimate value, not last
    while i < len(array) - 1:
        # NOTE: We use a while loop here because we want to
        #       check that in each iteration, i < len(array)-1
        # TODO: Save condition as a boolean variable 
        isPeak = array[i-1] < array[i] and array[i] > array[i+1]
        if not isPeak:
            # NOTE: There is nothing left to do so increase idx 
            #           and continue
            i += 1
            continue
        # TODO: Start left search
        # NOTE: We have a peak. We have confirmed that i - 1 is
        #       part of a peak so we want to start at i - 2
        leftIdx = i - 2
        # TODO: Iterate through the left to determine the left
        #       edge as long as we are in bounds and the leftIdx
        #       is less than the element to the right of it
        while leftIdx >= 0 and array[leftIdx] < array[leftIdx+1]:
            leftIdx -= 1
        # NOTE: Add two to get the index of the right edge
        #       element 
        rightIdx = i + 2
        # NOTE: Contrary to the while loop above, we iterate til
        #       the end because a peak could end at the end of 
        #       the array
        while rightIdx < len(array) and \
                array[rightIdx] < array[rightIdx-1]:
                    rightIdx += 1

        currentPeakLength = rightIdx - leftIdx - 1
        #TODO: Look for longest (Compare)
        longestPeakLength = max(longestPeakLength, \
                currentPeakLength)
        # NOTE: We no longer need to look at the values of the
        #       current peak so skip to the position ahead of the
        #       peak
        i = rightIdx
    return longestPeakLength

if __name__ == "__main__":
    print(longestPeak(array))
