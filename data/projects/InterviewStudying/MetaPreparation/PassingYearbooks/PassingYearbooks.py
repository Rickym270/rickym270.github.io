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

'''

# Write your code here
def findSignatureCounts(arr):
    # Write your code here
    # TODO: Return number of sigs
    res = []

    # TODO: Iterate th rough arr
    for i, person in enumerate(arr):
        # TODO: Since the first person signs their own yearbook, start at 1
        signatures = 1
        # TODO: Get current student
        current_student = arr[i]
        # TODO: Get next student
        next_student = arr[current_student - 1]

        # TODO: If they pass it to themselves, end
        if next_student == current_student:
            res.append(signatures)
            continue
        else:
            signatures += 1
        res.append(signatures)

    return res


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
