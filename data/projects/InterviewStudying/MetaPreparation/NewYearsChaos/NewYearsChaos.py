#!/usr/bin/python3
problems = [
    [[2, 1, 5, 3, 4], [2, 5, 1, 3, 4]],
    [[5, 1, 2, 3, 7, 8, 6, 4], [1, 2, 5, 3, 7, 8, 6, 4]],
    [[1, 2, 5, 3, 4, 7, 8, 6]]
]

'''
    It is New Year's Day and people are in line for the Wonderland rollercoaster ride. Each person wears a sticker 
    indicating their initial position in the queue from  to . Any person can bribe the person directly in front of them 
    to swap positions, but they still wear their original sticker. One person can bribe at most two others.
    Determine the minimum number of bribes that took place to get to a given queue order. Print the number of bribes, 
    or, 
    if anyone has bribed more than two people, print Too chaotic.

    Example
        If person  bribes person , the queue will look like this: . Only  bribe is required. Print 1.
        Person  had to bribe  people to get to the current position. Print Too chaotic.
'''
def count_skips(q):
    # TODO: Init bribes
    bribes = 0

    for i in reversed(range(len(q))):
        # TODO: Since i+1 is the expected, if current value isn't expected,
        if q[i] != i+1:
            print("i: {}".format(i))
            # TODO: Since we are reversed, if the previous element is equal to the next element
            if q[i-1] == i+1:
                print("One bribe has taken place between {} snd {}".format(i, q[i-1]))
                bribes += 1
                q[i-1], q[i] = q[i], q[i-1]
            elif q[i-2] == i + 1:
                print("Two bribe has taken place between {} snd {}".format(i, q[i-2]))
                # This works because
                #       [1, 2, 3, 4] -> [1, 4, 2, 3]
                #   1 swap: [1, 2, 4, 3]
                #   2 swap: [1, 4, 2, 3] q[i - 2] == (i = 3)
                bribes += 2
                q[i - 2], q[i - 1], q[i] = q[i - 1], q[i], q[i - 2]
            else:
                print("Too chaotic")
                return
    return bribes


if __name__ == "__main__":
    for problem_set in problems:
        for num, problem in  enumerate(problem_set):
            print("{}: {}".format(num, problem))
            print(count_skips(problem))
            print("\n\n")
