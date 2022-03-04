'''
There are n students, numbered from 1 to n, each with their own yearbook. They would like to pass their yearbooks around
and get them signed by other students.
You're given a list of n integers arr[1..n], which is guaranteed to be a permutation of 1..n (in other words, it
includes the integers from 1 to n exactly once each, in some order). The meaning of this list is described below.
Initially, each student is holding their own yearbook. The students will then repeat the following two steps each minute:
 Each student i will first sign the yearbook that they're currently holding (which may either belong to
themselves or to another student), and then they'll pass it to student arr[i-1]. It's possible that arr[i-1] = i for any
 given i, in which case student i will pass their yearbook back to themselves. Once a student has received their own
 yearbook back, they will hold on to it and no longer participate in the passing process.
It's guaranteed that, for any possible valid input, each student will eventually receive their own yearbook back and
will never end up holding more than one yearbook at a time.

You must compute a list of n integers output, whose element at i-1 is equal to the number of signatures that will be
present in student i's yearbook once they receive it back.

I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU. I LOVE YOU.
'''

def findSignatureCounts(arr):
    visited_students = set()
    signatures = [0] * len(arr)
    root_indexes = [-1] * len(arr)

    # TODO: Traverse through the array
    for i in range(len(arr)):
        # TODO: Create a frequency map to determine which student has been seen to avoid traversing a node more than
        #       once
        student = arr[i]        # TODO: Get current student (arr[i])
        if student in visited_students:
            # TODO: Don't add the student again if student has
            continue
        visited_students.add(student)

        # consider the current student to be the root of a cycle, and traverse back to itself
        signatures[i] = 1
        next_i = student - 1
        while next_i != i:
            signatures[i] += 1
            root_indexes[next_i] = i
            visited_students.add(arr[next_i])
            next_i = arr[next_i] - 1

    # return the signature counts of the root nodes, and the referenced root node counts of traversed nodes
    for i in range(len(arr)):
        if root_indexes[i] != -1:
            signatures[i] = signatures[root_indexes[i]]
    return signatures


# def findSignatureCounts(arr):
#     # TODO: Init vars
#     print("Runing Test with: {}".format(arr))
#     n = len(arr)
#     res = [0] * n
#
#     # TODO: Determine who the book belongs to
#     # owner = arr[0]
#     # print("Owner: {}".format(owner))
#     # TODO: Since student signs their own yearbook, initialize count at 1
#     count = 1
#     # TODO: Pass the book to whoever is at array[i + 1], while the book isn't at the original owner
#
#
#     for i in range(n):
#         # NOTE: i == owner
#         print("{}: Iterating...".format(i))
#         # TODO: As long as there is a i+1 element
#         while i != owner and i < n:
#             print("While {} < {}... Incrementing count".format(i, n))
#             # TODO: Increment count
#             res[i] = count + 1
#             i += 1
#         # #TODO: Save count into res[i]
#         # print("i: {}\nres: {}".format(n, res))
#         # res[i] += count
#     # TODO: Return res
#     return res


# These are the tests we use to determine if the solution is correct.
# You can add your own at the bottom.

def printInteger(n):
    print('[', n, ']', sep='', end='')


def printIntegerList(array):
    size = len(array)
    print('[', end='')
    for i in range(size):
        if i != 0:
            print(', ', end='')
        print(array[i], end='')
    print(']', end='')


test_case_number = 1


def check(expected, output):
    global test_case_number
    expected_size = len(expected)
    output_size = len(output)
    result = True
    if expected_size != output_size:
        result = False
    for i in range(min(expected_size, output_size)):
        result &= (output[i] == expected[i])
    rightTick = '\u2713'
    wrongTick = '\u2717'
    if result:
        print(rightTick, 'Test #', test_case_number, sep='')
    else:
        print(wrongTick, 'Test #', test_case_number, ': Expected ', sep='', end='')
        printIntegerList(expected)
        print(' Your output: ', end='')
        printIntegerList(output)
        print()
    test_case_number += 1


if __name__ == "__main__":
    arr_1 = [2, 1]
    expected_1 = [2, 2]
    output_1 = findSignatureCounts(arr_1)
    check(expected_1, output_1)

    arr_2 = [1, 2]
    expected_2 = [1, 1]
    output_2 = findSignatureCounts(arr_2)
    check(expected_2, output_2)

    # Add your own test cases here
