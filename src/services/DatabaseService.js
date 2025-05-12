const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

class DatabaseService {
  constructor() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'teamtracker.db');
    
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database opening error: ', err);
      } else {
        this.initTables();
      }
    });
  }
  
  initTables() {
    // Create tables if they don't exist
    this.db.serialize(() => {
      // Players table
      this.db.run(`CREATE TABLE IF NOT EXISTS players (
        puuid TEXT PRIMARY KEY,
        summonerName TEXT,
        profileIconId INTEGER,
        summonerLevel INTEGER,
        lastUpdated INTEGER
      )`);
      
      // Matches table
      this.db.run(`CREATE TABLE IF NOT EXISTS matches (
        matchId TEXT PRIMARY KEY,
        gameCreation INTEGER,
        gameDuration INTEGER,
        queueId INTEGER
      )`);
      
      // Player performance in matches
      this.db.run(`CREATE TABLE IF NOT EXISTS performance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        matchId TEXT,
        puuid TEXT,
        championId INTEGER,
        teamId INTEGER,
        win INTEGER,
        kills INTEGER,
        deaths INTEGER,
        assists INTEGER,
        totalDamageDealt INTEGER,
        visionScore INTEGER,
        goldEarned INTEGER,
        totalMinionsKilled INTEGER,
        teammatePuuid TEXT,
        teammateScore REAL,
        FOREIGN KEY (matchId) REFERENCES matches (matchId),
        FOREIGN KEY (puuid) REFERENCES players (puuid)
      )`);
    });
  }

  // Add methods to save and retrieve data from database
  // ...
}

module.exports = new DatabaseService();