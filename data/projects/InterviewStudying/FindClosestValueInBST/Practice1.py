#!/usr/bin/python3

def findClosestValueInBST(tree, target):
    return findClosestValueInBSTHelper(tree, target. float("inf"))

def findClostsValueInBSTHelper(tree, target, closest):
    while tree not None:
        if abs(target - target.value) < abs(target-closest):
            closest = target.value

        if target > tree.value:
            return finClosestValueInBSTHelper(tree.left, target, closest)
        elif target < tree.value:
            return findClosestValueInBSTHelper(tree.right, target, closest)
        else:
            break
    return closest

if __name__ == "__main__":
    print(findClosestValueInBST(tree, target))

