#!/usr/bin/python3

HOME_TEAM_WON = 1
competitions = [
  ["HTML", "C#"],
  ["C#", "Python"],
  ["Python", "HTML"]
]
results = [0, 0, 1]

def tournamentWinner(competitions, results):
    # Iterate through a list. 
    # NOTE: competition index corresponds with winner
    currentBestTeam = ""
    scores = { currentBestTeam: 0 }
    for idx, competition in enumerate(competitions):
        homeTeam, awayTeam = competition
        # NOTE: Get the current winner
        currentWinner = homeTeam if results[idx] == HOME_TEAM_WON else awayTeam
        # NOTE: Update the points
        updateWinner(currentWinner, 3, scores)
        # NOTE: Update the team with most points as the currentBestTeam
        if scores[currentWinner] > scores[currentBestTeam]:
            currentBestTeam = currentWinner
    return currentBestTeam

def updateWinner(winner, points, scores):
    if winner not in scores:
        scores[winner] =  0
    scores[winner] += points

if __name__ == "__main__":
    print(tournamentWinner(competitions, results))
