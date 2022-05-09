'''
    Given a landmap , return the sizes of the rivers
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
    visited = [[False for _ in row] for row in matrix]

    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            if visited[i][j]:
                continue
            traverse_node(i, j, matrix, sizes, visited)
    return sizes

def traverse_node(i, j, matrix, sizes, visited):
    current_river_size = 0
    current_neighbor_nodes = [[i, j]]

    while len(current_neighbor_nodes):
        current_node = current_neighbor_nodes.pop()
        i = current_node[0]
        j = current_node[1]

        if visited[i][j]:
            continue
        visited[i][j] = True
        if matrix[i][j] == 0:
            continue

        current_river_size += 1
        neighboring_nodes = get_neighbor_nodes(i, j, matrix, visited)

        for neighbor in neighboring_nodes:
            current_neighbor_nodes.append(neighbor)
    if current_river_size > 0:
        sizes.append(current_river_size)

def get_neighbor_nodes(i, j, matrix, visited):
    neighbor_nodes = []
    if i > 0 and not visited[i-1][j]:
        neighbor_nodes.append([i-1, j])
    if i < len(matrix) - 1 and not visited[i+1][j]:
        neighbor_nodes.append([i+1, j])
    if j > 0 and not visited[i][j-1]:
        neighbor_nodes.append([i, j - 1])
    if j < len(matrix[0]) - 1 and not visited[i][j+1]:
        neighbor_nodes.append([i, j+1])
    return neighbor_nodes

if __name__ == "__main__":
    print(river_sizes(land_map))
