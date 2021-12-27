#!/usr/bin/python3
array = [5, 1, 4, 2]

def arrayOfProducts(array):
    products = [1 for i in range(len(array))]
    leftProducts = [1 for i in range(len(array))]
    rightProducts = [1 for i in range(len(array))]

    leftRunningProduct = 1
    for i in range(len(array)):
        leftProducts[i] = leftRunningProduct
        leftRunningProduct += array[i]

    rightRunningProduct = 1
    for i in range(len(array)):
        rightProducts[i] = rightRunningProduct
        rightRunningProduct += array[i]

    for i in range(products):
        products[i] = leftProducts[i] * rightProducts[i]

    return products

if __name__ == "__main__":
    print(arrayOfProducts(array))