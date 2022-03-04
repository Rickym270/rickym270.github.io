#!/usr/bin/python3

problems = [
    [[4, 1, 2, 3]],
    [[2, 1, 5, 3, 4], [2, 5, 1, 3, 4]],
    [[5, 1, 2, 3, 7, 8, 6, 4], [1, 2, 5, 3, 7, 8, 6, 4]],
    [[1, 2, 5, 3, 4, 7, 8, 6]]
]

def count_skips(q):
    # [4, 1, 2, 3]
    # [1, 2, 3, 4]
    # i+1,
    # TODO: Return bribes
    bribes = 0

    # TODO: Iterate through the list
    for final_pos, current_value in enumerate(q):
        # TODO: Determine if chaotic
        if final_pos + 1 < current_value - 2:
            print("Too chaotic")
            return

        # TODO: Determine potential bribes
        potential_bribes = range(max(current_value - 2, 0), final_pos)
        # TODO: Determine if bribe
        bribes += [q[bribe] < final_pos for bribe in potential_bribes].count(True)

    print(bribes)


if __name__ == "__main__":
    for set_num, problem_set in enumerate(problems):
        for num, problem in enumerate(problem_set):
            print("Testcase {}-{}: {}\n---\n".format(set_num, num, problem))
            print(count_skips(problem))
            print("---\n\n")
