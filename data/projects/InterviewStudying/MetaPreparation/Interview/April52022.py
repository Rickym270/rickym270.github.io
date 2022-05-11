'''
    Q1 Depth Sum:
        -Imagine an array that contains both integers and nested arrays, such as the following: [8, 4, [5, [9], 3], 6]. The depth sum is described as the weighted sum of each integer, weighted by their respective depths. In the example, 8's depth is 1, while 9's is 3.
        -Given such an array, calculate its depth sum.
        For example:
            Input: [4, [5, 6]]
            Output: 4 + 2 * 5 + 2 * 6 = 26
            Input: [8, 4, [5, [9], 3], 6]
            Output: 8 + 4 + 2 * 5 + 3 * 9 + 2 * 3 + 6 = 61
'''

# arrayLists = [4, [5, 6]]
arrayLists = [8, 4, [5, [9], 3], 6]
res = 0

def depth_sum(arr, depth):
    global res

    for item in arr:
        if type(item) is int:
            res += depth * item
        else:
            depth_sum(item, depth + 1)

    return res

def depth_sum(arr, depth):
    global res

    # TODO: Iterate through the array
    for item in arr:
        # TODO: Check if item is integer
        if type(item) is int:
            res += item * depth
        else:
            depth_sum(item, depth + 1)
    return res

if __name__ == "__main__":
    print(depth_sum(arrayLists, 1))
