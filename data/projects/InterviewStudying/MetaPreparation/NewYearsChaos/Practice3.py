#!/usr/bin/python3

problems = [
    [[4, 1, 2, 3]],
    [[2, 1, 5, 3, 4], [2, 5, 1, 3, 4]],
    [[5, 1, 2, 3, 7, 8, 6, 4], [1, 2, 5, 3, 7, 8, 6, 4]],
    [[1, 2, 5, 3, 4, 7, 8, 6]]
]

def count_skips(q):
    # [4, 1, 2, 3]
    # TODO: Init bribes
    bribes = 0

    # TODO: Iterate through q
    for final_pos, current_val in enumerate(q):
        # TODO: Find if too chaotic
        if final_pos + 1 < current_val - 2:
            print("Too Chaotic")
            return

        # TODO: Get potential bribes
        potential_bribes = range(max(current_val - 2, 0), final_pos)
        # TODO: Get bribes
        bribes += [q[bribe] < final_pos for bribe in potential_bribes].count(True)
    return bribes

if __name__ == "__main__":
    for set_num, problem_set in enumerate(problems):
        for num, problem in enumerate(problem_set):
            print("Testcase {}-{}: {}\n---\n".format(set_num, num, problem))
            print(count_skips(problem))
            print("---\n\n")
