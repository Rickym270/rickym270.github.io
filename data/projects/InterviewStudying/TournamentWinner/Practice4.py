#!/usr//bin/python4

competitions = [
    ["HTML", "Java"],
    ["Java", "Python"],
    ["Python", "HTML"]
  ]
results = [0, 1, 1]
HOME_TEAM_WON = 1

def tournamentWinner(competitions, results):
    currentBestWinner = ""
    scores = {currentBestWinner: 0}
    for idx, competition in enumerate(competitions):
        result = results[idx]
        homeTeam, awayTeam = competition
        currentWinner = homeTeam if result == HOME_TEAM_WON else awayTeam
        #NOTE: Update scores
        updateScores(currentWinner, 3, scores)
        #NOTE: Update current best winner
        if scores[currentWinner] > scores[currentBestWinner]:
            currentBestWinner = currentWinner
    return currentBestWinner
        
def updateScores(winner, points, scores):
    if winner not in scores:
        scores[winner] = 0
    scores[winner] += points
    

if __name__ == "__main__":
    print(tournamentWinner(competitions, results))
