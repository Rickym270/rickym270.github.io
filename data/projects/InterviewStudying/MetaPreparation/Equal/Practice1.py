'''
    Given two arrays A and B of length N, determine if there is a way to make A
    equal to B by reversing any subarrays from array B any number of times.

    Example
        A = [1, 2, 3, 4]
        B = [1, 4, 3, 2], 1, 3, 4, 2: 1,3,2,4 : 1,2,3,4
    output = true
    After reversing the subarray of B from indices 1 to 3, array B will equal array A.
'''
# Compoare numbers in list to see if the lists are the same.
#   NOTE: If all elements in array_a have been seen in array_b, there is a way to
#           make A equal to B, reversing any subarrays from B any number of times
#               THIS MEANS UNLIMITED SUBARRAY REVERSALS.
def are_they_equal(target, array_b):
    # TODO: Init frequency_map (target)
    frequency_map = {}
    # TODO: Populate frequency nmap
    for i in target:
        if i not in frequency_map:
            frequency_map[i] = 1
        else:
            frequency_map[i] += 1
    print(frequency_map)
    # TODO: Iterate through array_b
    for i in range(len(array_b)):
        # TODO: If the current element is in frequency map
        if array_b[i] in frequency_map and frequency_map[array_b[i]] > 0:
            frequency_map[array_b[i]] -= 1
        # TODO: Return False
        else:
            return False
    # TODO: Return true
    return True














# These are the tests we use to determine if the solution is correct.
# You can add your own at the bottom.
def printString(string):
  print('[\"', string, '\"]', sep='', end='')

test_case_number = 1

def check(expected, output):
  global test_case_number
  result = False
  if expected == output:
    result = True
  rightTick = '\u2713'
  wrongTick = '\u2717'
  if result:
    print(rightTick, 'Test #', test_case_number, sep='')
  else:
    print(wrongTick, 'Test #', test_case_number, ': Expected ', sep='', end='')
    printString(expected)
    print(' Your output: ', end='')
    printString(output)
    print()
  test_case_number += 1

if __name__ == "__main__":
  n_1 = 4
  a_1 = [1, 2, 3, 4]
  b_1 = [1, 4, 3, 2]
  expected_1 = True
  output_1 = are_they_equal(a_1, b_1)
  check(expected_1, output_1)

  n_2 = 4
  a_2 = [1, 2, 3, 4]
  b_2 = [1, 2, 3, 5]
  expected_2 = False
  output_2 = are_they_equal(a_2, b_2)
  check(expected_2, output_2)

  # Add your own test cases here
