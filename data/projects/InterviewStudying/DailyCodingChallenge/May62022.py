'''
    You are given an M by N matrix consisting of booleans that represents a board. Each True boolean represents a wall.
    Each False boolean represents a tile you can walk on.

    Given this matrix, a start coordinate, and an end coordinate, return the minimum number of steps required to reach
    the end coordinate from the start. If there is no possible path, then return null. You can move up, left, down, and
    right. You cannot move through walls. You cannot wrap around the edges of the board.

    For example, given the following board:

    [[f, f, f, f],
    [t, t, f, t],
    [f, f, f, f],
    [f, f, f, f]]
    and start = (3, 0) (bottom left) and end = (0, 0) (top left), the minimum number of steps required to reach the end
    is 7, since we would need to go through (1, 2) because there is a wall everywhere else on the second row.
'''
f = "False"
t = "True"
matrix = [
    [f, f, f, f],
    [t, t, f, t],
    [f, f, f, f],
    [f, f, f, f]]
start = (3, 0)
end = (0, 0)
def ShortestPath(matrix, start, end):
    # TODO: Store coordinates of start and end
    p = start[0]
    q = start[1]

    a = end[0]
    b = end[1]

    st
    # TODO: Traverse Rows
    for col in range(startRow, endRow):
        print(matrix[startRow][col])


    print(start)
    print(start_startRow)
    print(start_endRow)

    return

if __name__ == "__main__":
    print(ShortestPath(matrix, start, end))
