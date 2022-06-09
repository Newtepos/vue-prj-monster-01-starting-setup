function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
    };
  },
  watch: {
    playerHealth(value) {
      if (value < 0 && this.monsterHealth < 0) {
        this.winner = "draw";
      } else if (value < 0) {
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value < 0 && this.playerHealth < 0) {
        this.winner = "draw";
      } else if (value < 0) {
        this.winner = "player";
      }
    },
  },
  computed: {
    monsterBarStyle() {
      if (this.monsterHealth < 0) {
        return { width: 0 + "%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyle() {
      if (this.playerHealth < 0) {
        return { width: 0 + "%" };
      }
      return { width: this.playerHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },
  methods: {
    resetGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.logMessages = [];
    },
    attackMonster() {
      this.currentRound++;
      const normalAttack = randomNumber(5, 12);
      this.addLogMessage('player', 'attack', normalAttack);
      this.monsterHealth = this.monsterHealth - normalAttack;
      this.attackPlayer();
    },
    attackPlayer() {
      const normalAttack = randomNumber(5, 12);
      this.playerHealth = this.playerHealth - normalAttack;
      this.addLogMessage('monster', 'attack', normalAttack);
    },
    useSpecialAttack() {
      this.currentRound++;
      const specialAttack = randomNumber(15, 25);
      this.monsterHealth = this.monsterHealth - specialAttack;
      this.addLogMessage('player', 'attack', specialAttack);
      this.attackPlayer();
    },
    useHeal() {
      this.currentRound++;
      const healValue = randomNumber(15, 25);
      this.addLogMessage('player', 'heal', healValue);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth = this.playerHealth + healValue;
      }
      this.attackPlayer();
    },
    surrender() {
      this.playerHealth = 0;
      this.winner = "monster";
      this.addLogMessage('player', 'surrender', 0);
    },
    addLogMessage(who, action, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: action,
        actionValue: value
      });
    },
    attackTypeStyle(action) {
      return {'log--player': action === 'player'  , 'log--monster': action === 'monster'}
    }
  },
});

app.mount("#game");
