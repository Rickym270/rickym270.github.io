#!/usr/bin/python3

problems = [
    [[4, 1, 2, 3]],
    [[2, 1, 5, 3, 4], [2, 5, 1, 3, 4]],
    [[5, 1, 2, 3, 7, 8, 6, 4], [1, 2, 5, 3, 7, 8, 6, 4]],
    [[1, 2, 5, 3, 4, 7, 8, 6]]
]

def count_skips(q):
    # [4, 1, 2, 3]
    bribes = 0
    # TODO: Iterate through array
    for final_pos, current_pos in enumerate(q):
        # TODO: Determine if chaotic
            # NOTE: Ideal_val = final_pos + 1
        if final_pos + 1 < current_pos - 2:
            print("Too chaotic")
            return
        # TODO: Determine potential bribes
        # NOTE: A briber can only bribe the person in front of them
        # NOTE: Once we find current_val != ideal_val
        # NOTE: From current idx to end of where it's supposed to be
        # NOTE: Can't be negative

        potential_bribes = range(max(current_pos - 2, 0), final_pos)

        # TODO: Count bribes
        # NOTE: Since we can only trade forward,  the indication that someone bribed is if there's number less than us
        #           in front of us
        bribes += [q[bribe] < final_pos for bribe in potential_bribes].count(True)
    # TODO: Return bribes
    return bribes


if __name__ == "__main__":
    for set_num, problem_set in enumerate(problems):
        for num, problem in enumerate(problem_set):
            print("Testcase {}-{}: {}\n---\n".format(set_num, num, problem))
            print(count_skips(problem))
            print("---\n\n")
