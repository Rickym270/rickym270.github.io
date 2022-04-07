#!/usr/bin/python3
problems = [
    [[1, 2, 3, 4, 5]],
    [[2, 1, 2, 1, 2]]
]
from queue import PriorityQueue

def largestTripleProducts(arr):
    res = []
    q = PriorityQueue()

    for i in range(len(arr)):
        q.put(-arr[i])
        if len(res) < 2:
            res.append(-1)
        else:
            x = q.get()
            y = q.get()
            z = q.get()

            res.append(-(x * y * z))

            q.put(x)
            q.put(y)
            q.put(z)
    while not q.empty():
        print(q.get())

    return res

if __name__ == "__main__":
    for set_num, problem_set in enumerate(problems):
        for num, problem in enumerate(problem_set):
            print("Testcase {}-{}: {}\n---\n".format(set_num, num, problem))
            print(largestTripleProducts(problem))
            print("---\n\n")