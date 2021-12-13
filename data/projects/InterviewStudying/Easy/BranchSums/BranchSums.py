#!/usr/bin/python3

def branchSum(root):
    # NOTE: Keep track of the running sum that we've been calculating
    #       At every node, the running sum will be equal to the sum of 
    #       every node above it.

    #NOTE: Doesn't return anything but only appends items to the list
    sums = []
    calculateBranchSums(root, 0, sums)
    return sums

def calculateBranchSums(node, runningSum, sums):
    # NOTE: Calculate value of the new running sum
    #       Add the value of the current node to the runningSum
    newRunningSum = runningSum + node.value
    # NOTE: IF at a leaf node, we've calculated the branch sum.
    #       IF at a leaf node, newRunningSum is also the branch sum
    if node.left is None and node.right is None:
        sums.append(newRunningSum)
        return                      # NOTE: Done to do other things still

    # NOTE: If not at a leaf node, keep calculating sums
    calculateBranchSums(node.left, newRunningSum, sums)
    calculateBranchSums(node.right, newRunningSum, sums)

if __name__ == "__main__":
    print(branchSums(root))
