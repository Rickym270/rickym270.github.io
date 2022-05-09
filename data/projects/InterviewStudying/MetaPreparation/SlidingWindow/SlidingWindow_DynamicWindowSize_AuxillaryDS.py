'''
    DYNAMIC SIZED WINDOW + AUXILLARY DS
    https://www.youtube.com/watch?v=MK-NZ4hN7rs
    
    Print out smallest subarray size, such that value is >= 8
    [4, 2, 1, 7, 8, 1, 2, 8, 1, 0], k=3

    Returns 1
'''

def findMaxSumSubarray(array):
    # NOTE: We need another index that can increase and decrease in size,
    # NOTE: Output[i] = L[i] + R[i] - 1
    n = len(array)
    # TODO: Create empty array initialized as [1,1,1,...,1]
    res = [1] * n
    # TODO: Create stack
    #   NOTE: Stack must always have one element
    #   NOTE: We want this as negative one because we do a comparison on line 26 and -1 is less than any positive int
    stack = [-1]

    # TODO: Traverse left->right
    for i in range(n):
        # TODO: While stack has more than one element and previous element < current
        #       element, remove the last element of stack
        #       WHY?
        #           We want to only keep track of
        while len(stack) > 1 and array[stack[-1]] < array[i]:
            stack.pop()
        res[i] += i - stack[-1] - 1
        stack.append(i)

    # from right
    stack = [n]
    for i in reversed(range(n)):
        while len(stack) > 1 and array[stack[-1]] < array[i]:
            stack.pop()
        res[i] += stack[-1] - i - 1
        stack.append(i)
    return res

if __name__ == "__main__":
    print(findMaxSumSubarray([3, 4, 1, 6, 2]))
