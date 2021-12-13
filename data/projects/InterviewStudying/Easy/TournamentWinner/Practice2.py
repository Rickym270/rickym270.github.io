#!/usr/bin/python3

competitions = [
  ["HTML", "C#"],
  ["C#", "Python"],
  ["Python", "HTML"]
]
results = [0, 1, 1]
HOME_TEAM_WON = 1

def tournamentWinner(competitions, results):
    currentBestTeam = ""
    scores = {currentBestTeam : 0}
    for idx, competition in enumerate(competitions):
        # 0: html vs c#
        #        0
        # 1: c# vs python
        #        0
        # 2: Python vs. HTML
        #        1
        result = results[idx]
        homeTeam, awayTeam = competition

        # NOTE: Determine current winner 
        currentWinner = homeTeam if result == HOME_TEAM_WON else awayTeam

        # NOTE: Update scores
        updateScores(currentWinner, 3, scores)

        # NOTE: Update current best team
        if scores[currentWinner] > scores[currentBestTeam]:
            currentBestTeam = currentWinner

    return currentBestTeam

def updateScores(winner, points, scores):
    if winner not in scores:
        scores[winner] = 0
    scores[winner] += points

if __name__ == "__main__":
    print(tournamentWinner(competitions, results))

