class ScoreCalculator {
  calculateTeammateScore(playerStats, matchData) {
    // This is a simplified scoring algorithm
    // You can make this as complex as you want
    
    const kda = (playerStats.kills + playerStats.assists) / Math.max(1, playerStats.deaths);
    const kdaScore = this.normalizeScore(kda, 0, 10) * 0.4;
    
    const visionScore = this.normalizeScore(playerStats.visionScore, 0, 100) * 0.1;
    
    const csPerMin = playerStats.totalMinionsKilled / (matchData.gameDuration / 60);
    const csScore = this.normalizeScore(csPerMin, 0, 10) * 0.2;
    
    const damageShare = playerStats.totalDamageDealtToChampions / 
                        matchData.teams.reduce((acc, team) => 
                          acc + team.participants.reduce((sum, p) => 
                            sum + p.totalDamageDealtToChampions, 0), 0);
    const damageScore = this.normalizeScore(damageShare, 0, 0.3) * 0.3;
    
    // Calculate final score (0-10 scale)
    let finalScore = kdaScore + visionScore + csScore + damageScore;
    
    // Round to 1 decimal place
    return Math.round(finalScore * 10) / 10;
  }
  
  normalizeScore(value, min, max) {
    return Math.min(1, Math.max(0, (value - min) / (max - min)));
  }
  
  getScoreColor(score) {
    if (score < 4.0) return "score-low";
    if (score < 6.0) return "score-medium";
    return "score-high";
  }
}

module.exports = new ScoreCalculator();