#!/usr/bin/python3

HOME_TEAM_WON = 1

def tournamentWinner(competition, results):
    currentBestTeam = ""
    scores = {currentBestTeam: 0}

    for idx, competition in enumerate(competition):
        result = results[idx]
        homeTeam, awayTeam = competition

        winningTeam = homeTeam if result == HOME_TEAM_WON else awayTeam

        updateScores(winningTeam, 3, scores)

        if scores[winningTeam] > scores[currentBestTeam]:
            currentBestTeam = winningTeam

    return currentBestTeam

def updateScores(team, points, scores):
    if team not in scores:
        scores[team] = 0

    scores[team] += points

if __name__ == "__main__":
    competitions = [
        ["HTML", "C#"],
        ["C#", "Python"],
        ["Python", "HTML"]
    ]
    results = [0, 0, 1]
    print(tournamentWinner(competitions, results))

'''
    Explanation:
        Line 3: For readability, set a variable that denotes the home team won.
        Line 5: Function definition
        Line 6: Define a variable to store the currentBestTeam
        Line 7: Define the data structure that will keep track of each teams scores
        Line 9: Use a for loop with the enumerate function to obtain an index and the item at that
                index.
                    Why?
                        This avoids the need for 2 loops. Since the competition index references the 
                            result of the competition in the results list, it is appropriate to assume
                            that competition 1 maps to result 1, competition 2 maps to result 2 etc.
        Line 10: Store the current result in a variable
        Line 11: Store the homeTeam and awayTeam in variables
                    Notation?
                        This notation works for python. Since competitions are denoted as ["T1", "T2"]
                        we can split the results like this,
        Line 13: Here we are saying that the winningTeam is the homeTeam if the current result
                 indicates that the homeTeam won, else set the awayTeam as the winningTeam.
                     Why is it written like this?
                        This is a python one liner if-else. This is done to build more 'compact' and 
                        readable code and sometimes more efficient.
        Line 15: Update the scores. This is done in a seperate function to make the code more legible
        Line 17: If the current score of the winningTeam is higher than the current score of the 
                 currentBestTeam, set the currentBestTeam = winningTeam
        Line 20: Return the currentBestTeam

        Line 22: Function definition
        Line 23-24: If the team is not in the scores dictionary, initialize that team into the scores
                    dictionary and set it to 0 points.
                    Why?
                        If a team that isn't in the results dictionary wins and we try to update the 
                        points for that team, a KeyError will be thrown because we are referencing a 
                        non-existant team.
        Line 26: Increment the team points by the specified number of points
'''
