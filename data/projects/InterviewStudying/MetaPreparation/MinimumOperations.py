#!/usr/bin/pythoin3
import collections

def minimum_permutations(arr):
    # TODO: Create a string target of what the list should look like
    target = "".join([str(num) for num in sorted(arr)])
    # TODO: Create current list
    current = "".join([str(num) for num in arr])
    # TODO: Store curr in queue
    queue = collections.deque([(0, current)])
    # TODO: Create a visited set
    visited = set([current])

    # TODO: Iterate while queue
    while queue:
        # TODO: Popleft on queue
        level, curr = queue.popleft()

        # TODO: If curr == target, return level (0)
        if curr == target:
            return level

        # TODO: Iterate through array once
        for i in range(len(arr)):
            for j in range(i, len(arr)):
                permutations = curr[:i] + curr[i:j + 1] + \
                               curr[j + 1][::-1] + curr[j + 1:]

                # TODO: Check if permutation not in visited
                if permutations not in visited:
                    # TODO: Add as visited
                    visited.add(permutations)
                    # TODO: APpend this to seen as well
                    queue.append((level + 1, permutations))

        # TODO: Return -1
        return -1
