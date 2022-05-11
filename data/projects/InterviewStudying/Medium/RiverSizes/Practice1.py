#!/usr/bin/python3
'''
    Given a landmap , return the sizes of the river
'''
# [1,2,2,2,5]
land_map = [
    [1, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
    [0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 1, 0]
]

def river_sizes(matrix):
    sizes = []
    visited = [[False for col in row] for row in matrix]

    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            if visited[i][j]:
                continue
            traverse_node(i, j, matrix, visited, sizes)
    return sizes

def traverse_node(i, j, matrix, visited, sizes):
    # TODO: Keep track of current river size and node to explore
    current_river_size = 0
    current_nodes_to_explore = [[i, j]]

    # TODO: While there are nodes to explore
    while len(current_nodes_to_explore):
        # TODO: Pop the node to explore and note the row and col
        current_node = current_nodes_to_explore.pop()
        i = current_node[0]
        j = current_node[1]
        if visited[i][j]:
            continue
        visited[i][j] = True
        if matrix[i][j] == 0:
            continue
        current_river_size += 1
        unvisited_nodes = get_unvisited_nodes(i, j, matrix, visited)
        for neighbor in unvisited_nodes:
            current_nodes_to_explore.append(neighbor)
    if current_river_size > 0:
        sizes.append(current_river_size)

def get_unvisited_nodes(i, j, matrix, visited):
    unvisited_neighbors = []
    if i > 0 and not visited[i - 1][j]:
        unvisited_neighbors.append([i-1, j])
    if i < len(matrix) - 1 and not visited[i+1][j]:
        unvisited_neighbors.append([i+1, j])
    if j > 0 and not visited[i][j-1]:
        unvisited_neighbors.append([i, j-1])
    if j < len(matrix[0]) - 1 and not visited[i][j+1]:
        unvisited_neighbors.append([i, j+1])
    return unvisited_neighbors

if __name__ == "__main__":
    print(river_sizes(land_map))
