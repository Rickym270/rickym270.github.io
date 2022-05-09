#!/usr/bin/python3
### DIVIDE AND CONQUER
def merge_k_lists(arr_set):
    # TODO: Check if arr set exists
    if len(arr_set) == 0:
        return None

    if len(arr_set) == 1:
        return arr_set[0]
    # TODO: Get midway point
    mid = len(arr_set) // 2

    print("Mid:L {}".format(mid))
    # TODO: Get left and right
    l, r = merge_k_lists(arr_set[:mid]), merge_k_lists(arr_set[mid:])
    print("Split into {} and {}".format(l, r))

    return merge(l, r)

def merge(l, r):
    temp = res = [-1] * (len(r or "") + len(l or ""))
    idxOne, idxTwo = 0, 0
    i = 0
    while l and r and idxOne < len(l) and idxTwo < len(r):


        if l[idxOne] < r[idxTwo]:
            temp[i] = l[idxOne]
            idxOne += 1
        elif l[idxOne] > r[idxTwo]:
            temp[i] = r[idxTwo]
            idxTwo += 1
        else:
            temp[i] = l[idxOne]
            temp[i+1] = r[idxTwo]
            idxOne += 1
            idxTwo += 1
        i += 1
    # print("L: {}, R: {}".format(l[idxOne:], r[idxTwo:]))
    temp[i:] = l[idxOne:] or r[idxTwo:]

    return res

problem_sets = [
    [[1, 4, 5], [1, 3, 4], [2, 6]]
]

if __name__ == "__main__":
    for set in problem_sets:
        print(merge_k_lists(set))
