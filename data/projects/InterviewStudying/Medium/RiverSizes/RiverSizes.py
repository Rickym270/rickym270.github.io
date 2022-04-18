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
    # TODO: Init sizes and visited
    #           Visited should be False for every position not visited
    sizes = []
    visited = [[False for _ in row] for row in matrix]

    # TODO: Iter through rows and cols
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            # TODO: If has been visited, continue
            if visited[i][j]:
                continue
            # TODO: If not visited, traverse node
            traverse_node(i, j, matrix, visited, sizes)
    return sizes

def traverse_node(i, j, rivers, visited, sizes):
    # TODO: Keep track of current river size and nodes to explore
    current_river_size = 0
    nodes_to_explore = [[i, j]]
    # TODO: While there are nodes to explore
    while len(nodes_to_explore):
        # TODO: Remove and GET it
        current_node = nodes_to_explore.pop()
        i = current_node[0]
        j = current_node[1]
        # TODO: If node has been visited, continue
        if visited[i][j]:
            continue
        # TODO: Mark node as visited
        visited[i][j] = True
        # TODO: If land, continue
        if rivers[i][j] == 0:
            continue
        # TODO: We are at a non-visited 1 so increase counter
        current_river_size += 1
        # TODOL Get unvisited neighbors
        unvisited_neighbors = get_unvisited_neighbors(i, j, rivers, visited)
        for neighbor in unvisited_neighbors:
            # TODO: Append to list of nodes to explore
            nodes_to_explore.append(neighbor)

    if current_river_size > 0:
        sizes.append(current_river_size)

def get_unvisited_neighbors(i, j, rivers, visited):
    unvisited_neighbors = []
    if i > 0 and not visited[i - 1][j]:
        unvisited_neighbors.append([i-1, j])
    if i < len(rivers) - 1 and not visited[i+1][j]:
        unvisited_neighbors.append([i+1, j])
    if j > 0 and not visited[i][j - 1]:
        unvisited_neighbors.append([i, j-1])
    if j < len(rivers[0]) - 1 and not visited[i][j+1]:
        unvisited_neighbors.append([i, j+1])
    return unvisited_neighbors


if __name__ == "__main__":
    print(river_sizes(land_map))