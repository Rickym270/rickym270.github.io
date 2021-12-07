#!/usr/bin/python3

competitions = [
  ["HTML", "C#"],
  ["C#", "Python"],
  ["Python", "HTML"]
]
results = [0, 0, 1]

HOME_TEAM_WON = 1

def tournamentWinner(competitions, results):
    currentBestTeam = ""
    scores = { currentBestTeam: 0 }

    for idx, competition in enumerate(competitions):
        result = results[idx]
        homeTeam, awayTeam = competition

        currentWinner = homeTeam if result == HOME_TEAM_WON else awayTeam

        updateScores(currentWinner, 3, scores)

        if scores[currentWinner] > scores[currentBestTeam]:
            currentBestTeam = currentWinner
    
    return currentBestTeam

def updateScores(currentWinner, points, scores):
    if currentWinner not in scores:
        scores[currentWinner] = 0
    scores[currentWinner] += 3
    

if __name__ == "__main__":
    print(tournamentWinner(competitions, results))
