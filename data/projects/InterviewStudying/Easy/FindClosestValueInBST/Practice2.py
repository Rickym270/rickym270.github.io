#!/usr/bin/python3

def findClosestValueInBST(tree, target):
    return findClosestValueInBSTHelper(tree, target, float("inf"))

def findClosestValueInBSTHelper(tree, target, closest):
    while tree not None:
        if abs(target-closest) > abs(target - tree.value):
            closest = tree.value

        if target > tree.value:
            return findClosestValueInBSTHelper(tree.right, target, closest)
        elif target < tree.value:
            return findClosestValueInBSTHelper(tree.left, target, closest)
        else:
            break
    return closest

if __name__ == "__main__":
    print(findClosestValueInBST(tree, target))

