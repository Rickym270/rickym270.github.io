#!/usr/bin/python3

problems = [
    [[2, 1, 5, 3, 4], [2, 5, 1, 3, 4]],
    [[5, 1, 2, 3, 7, 8, 6, 4], [1, 2, 5, 3, 7, 8, 6, 4]],
    [[1, 2, 5, 3, 4, 7, 8, 6]]
]

def count_skips(q):
    # TODO: Return bribes
    bribes = 0

    # TODO: Iterate q
    for final_pos, current_val in enumerate(q):
        # TODO: Determine if too chaotic
        if final_pos + 1 < current_val - 2:
            print("Too chaotic")
            return

        # TODO: Determine potential bribes
        #           Create a list of numbers from current_val-2 to final_pos
        potential_bribes = range(max(current_val - 2, 0), final_pos)
        # TODO: Determine if a bribe by comparing to the final_pos
        bribes += [q[bribe] < final_pos for bribe in potential_bribes].count(True)

    return bribes

if __name__ == "__main__":
    for set_num, problem_set in enumerate(problems):
        for num, problem in enumerate(problem_set):
            print("Testcase {}-{}: {}\n---\n".format(set_num, num, problem))
            print(count_skips(problem))
            print("---\n\n")
