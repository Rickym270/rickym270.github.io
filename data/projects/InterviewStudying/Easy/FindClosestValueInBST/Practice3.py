#!/usr/bin/python3

def findClosestValueInBst(tree, target):
    return findClosestValueInBstHelper(tree, target, float("inf"))

def findClosestValueInBstHelper(tree, target, closest):
    while tree is not None:
        if abs(target - closest) > abs(target - tree.value):
            closest = tree.value

        if tree.value > target:
            return findClosestValueInBstHelper(tree.left, target, closest)
        elif tree.value < target:
            return findClosestValueInBstHelper(tree.right, target, closest)
        else:
            break

    return closest

if __name__ == "__main__":
    print(findClosestValueInBst(tree, target))

