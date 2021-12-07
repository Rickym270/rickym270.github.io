#!/usr/bin/python3

competitions = [
    ["HTML", "Java"],
    ["Java", "Python"],
    ["Python", "HTML"],
    ["C#", "Python"],
    ["Java", "C#"],
    ["C#", "HTML"],
    ["SQL", "C#"],
    ["HTML", "SQL"],
    ["SQL", "Python"],
    ["SQL", "Java"]
  ]
results = [0, 1, 1, 1, 0, 1, 0, 1, 1, 0]
HOME_TEAM_WON = 1

def tournamentWinner(competitions, results):
    currentBestTeam = ""
    scores = { currentBestTeam : 0 }
    for idx, competition in enumerate(competitions):
        result = results[idx]
        homeTeam, awayTeam = competition
        currentWinningTeam = homeTeam if result == HOME_TEAM_WON else awayTeam

        #NOTE: Update scores
        updateScores(currentWinningTeam, 3, scores)
        #NOTE: Update currentBestTeam
        if scores[currentWinningTeam] > scores[currentBestTeam]:
            currentBestTeam = currentWinningTeam

    return currentBestTeam

def updateScores(team, points, scores):
    if team not in scores:
        scores[team] = 0
    scores[team] += points

if __name__ == "__main__":
    print(tournamentWinner(competitions, results))
