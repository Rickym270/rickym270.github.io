#!/usr/bin/python3
array = [5, 1, 4, 2]

def arrayOfProducts(array):
    products = [1 for _ in array]

    #TODO: Calcyulate left products
    leftRunningProduct = 1
    for i in range(len(array)):
        products[i] = leftRunningProduct
        leftRunningProduct *= array[i]

    #TODO: Calculate right products
    rightRunningProduct = 1
    for i in reversed(range(len(array))):
        products[i] *= rightRunningProduct
        rightRunningProduct *= array[i]

    return products

if __name__ == "__main__":
    print(arrayOfProducts(array))
