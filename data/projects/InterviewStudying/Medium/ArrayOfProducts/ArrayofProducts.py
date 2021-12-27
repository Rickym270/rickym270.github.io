#!/usr/bin/python3
array = [5, 1, 4, 2]

def arrayOfProducts(array):
    # We want to find the product of all numbers in an array except for the current number so why do we multiply every number.
    products = [1 for _ in array]
    leftProducts = [1 for _ in array]
    rightProducts = [1 for _ in array]

    leftRunningProduct = 1
    for i in range(len(array)):
        leftProducts[i] = leftRunningProduct
        leftRunningProduct *= array[i]

    rightRunningProduct = 1
    for i in reversed(range(len(array))):
        # Why is this reversed?
        rightProducts[i] = rightRunningProduct
        rightRunningProduct *= array[i]

    for i in range(len(array)):
        products[i] = leftProducts[i] * rightProducts[i]

    return products


if __name__ == "__main__":
    print(arrayOfProducts(array))
