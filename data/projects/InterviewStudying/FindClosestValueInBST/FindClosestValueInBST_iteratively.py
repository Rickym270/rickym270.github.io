#!/usr/bin/python3
tree = {
    "nodes": [
      {"id": "10", "left": "5", "right": "15", "value": 10},
      {"id": "15", "left": "13", "right": "22", "value": 15},
      {"id": "22", "left": null, "right": null, "value": 22},
      {"id": "13", "left": null, "right": "14", "value": 13},
      {"id": "14", "left": null, "right": null, "value": 14},
      {"id": "5", "left": "2", "right": "5-2", "value": 5},
      {"id": "5-2", "left": null, "right": null, "value": 5},
      {"id": "2", "left": "1", "right": null, "value": 2},
      {"id": "1", "left": null, "right": null, "value": 1}
    ],
    "root": "10"
}
target = 12
closest = ""
def findClosestValueInBST(tree, target):
    return findClosestValueInBSTHelper(tree, target, float("inf"))

def findClosestValueInBSTHelper(tree, target, closest):
    while tree is not None:
        # NOTE: Continue the loop as long as we are not at a leaf
        if abs(target - closest) > abs(target - tree.value):
            #NOTE: If current closest distance from the target is 
            #       greater than the current tree value distance
            #       from the target, set the current value as the
            #       new closest value
            closest = tree.value
        if target < tree.value:
            # NOTE: if the current tree value is less than closest  
            #       value, explore the left side of the BST
            findClosestValueInBSTHelper(tree.left, target, closest)
        elif target > tree.value:
            # NOTE: If the current value is greater than the closest 
            #       valuem explore the right side of the BST
            findClosestValueInBSTHelper(tree.right, target, closest)
        else:
            break
    return closest

if __name__ == "__main__":
    print(findClosestValueInBST(tree, target))
