const axios = require('axios');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const API_KEY = process.env.RIOT_API_KEY;
const REGIONS = {
  NA: "na1",
  EUW: "euw1",
  EUNE: "eun1",
  KR: "kr"
};

class RiotAPI {
  constructor() {
    this.apiKey = API_KEY;
    this.region = REGIONS.NA; // Default region
  }

  setRegion(region) {
    if (REGIONS[region]) {
      this.region = REGIONS[region];
    }
  }

  async getSummonerByName(summonerName) {
    try {
      const response = await axios.get(
        `https://${this.region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`,
        { headers: { "X-Riot-Token": this.apiKey } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching summoner:", error);
      throw error;
    }
  }

  async getMatchHistory(puuid, count = 20) {
    try {
      // Get region routing value
      const routingValue = this.getRoutingValue();
      
      const response = await axios.get(
        `https://${routingValue}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`,
        { headers: { "X-Riot-Token": this.apiKey } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching match history:", error);
      throw error;
    }
  }

  async getMatchDetails(matchId) {
    try {
      // Get region routing value
      const routingValue = this.getRoutingValue();
      
      const response = await axios.get(
        `https://${routingValue}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
        { headers: { "X-Riot-Token": this.apiKey } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching match details:", error);
      throw error;
    }
  }

  // Helper to get routing value based on region
  getRoutingValue() {
    const region = this.region;
    if (["na1", "br1", "la1", "la2"].includes(region)) {
      return "americas";
    } else if (["euw1", "eun1", "tr1", "ru"].includes(region)) {
      return "europe";
    } else if (["kr", "jp1"].includes(region)) {
      return "asia";
    } else {
      return "sea";
    }
  }
}

module.exports = new RiotAPI();