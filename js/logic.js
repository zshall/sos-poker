// Generated by CoffeeScript 1.6.3
var Card, Deck, PokerDeck, PokerHand, d_bet_multiplier, d_ranks, d_suits, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Array.prototype.shuffle = function() {
  var counter, index, temp, _results;
  counter = this.length;
  temp = void 0;
  index = void 0;
  _results = [];
  while (counter > 0) {
    index = Math.floor(Math.random() * counter);
    counter--;
    temp = this[counter];
    this[counter] = this[index];
    _results.push(this[index] = temp);
  }
  return _results;
};

d_suits = {
  0: 'spades',
  1: 'clubs',
  2: 'hearts',
  3: 'diamonds'
};

d_ranks = {
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'j',
  12: 'q',
  13: 'k',
  14: 'a'
};

d_bet_multiplier = {
  0: 0,
  1: 0.5,
  2: 3,
  3: 7,
  4: 15,
  5: 30,
  6: 100,
  7: 150,
  8: 400,
  9: 5000
};

Card = (function() {
  function Card(suit, rank) {
    this.held = false;
    this.suit = suit;
    this.rank = rank;
  }

  Card.prototype.toString = function() {
    return "" + this.held + "\t" + d_ranks[this.rank] + " of " + d_suits[this.suit];
  };

  return Card;

})();

Deck = (function() {
  function Deck(shuffle) {
    var rank, suit, _i, _j;
    this.cards = [];
    for (suit = _i = 0; _i <= 3; suit = ++_i) {
      for (rank = _j = 2; _j <= 14; rank = ++_j) {
        this.cards.push(new Card(suit, rank));
      }
    }
    if (shuffle) {
      this.shuffle();
    }
  }

  Deck.prototype.toString = function() {
    var card, o, _i, _len, _ref;
    o = '';
    _ref = this.cards;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      card = _ref[_i];
      o += "" + card + "\t\n";
    }
    return o;
  };

  Deck.prototype.shuffle = function() {
    return this.cards.shuffle();
  };

  Deck.prototype.popCard = function() {
    return this.cards.pop();
  };

  return Deck;

})();

PokerDeck = (function(_super) {
  __extends(PokerDeck, _super);

  function PokerDeck() {
    _ref = PokerDeck.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PokerDeck.prototype.dealHand = function() {
    var card, hand, i, _i;
    hand = new PokerHand(this);
    for (i = _i = 0; _i <= 4; i = ++_i) {
      card = this.popCard();
      hand.cards.push(card);
    }
    return hand;
  };

  return PokerDeck;

})(Deck);

PokerHand = (function(_super) {
  __extends(PokerHand, _super);

  function PokerHand(parent, cards) {
    var card, _i, _len;
    if (cards == null) {
      cards = [];
    }
    this.parent = parent;
    this.cards = [];
    for (_i = 0, _len = cards.length; _i < _len; _i++) {
      card = cards[_i];
      this.cards.push(card);
    }
    this.getCurrentRanks();
    this.getCurrentSuits();
  }

  PokerHand.prototype.toggleHold = function(cardIndex) {
    if (this.cards[cardIndex].held) {
      return this.cards[cardIndex].held = false;
    } else {
      return this.cards[cardIndex].held = true;
    }
  };

  PokerHand.prototype.draw = function() {
    var card, i, _i, _ref1, _results;
    _results = [];
    for (i = _i = 0, _ref1 = this.cards.length - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      card = this.cards[i];
      if (!card.held) {
        this.parent.cards.splice(0, 0, this.cards.splice(i, 1));
        _results.push(this.cards.splice(1, 0, this.parent.popCard()));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  PokerHand.prototype.determinePokerHand = function() {
    this.getCurrentRanks();
    this.getCurrentSuits();
    if (this.royalFlush()) {
      return 9;
    } else if (this.straightFlush()) {
      return 8;
    } else if (this.fourKind()) {
      return 7;
    } else if (this.fullHouse()) {
      return 6;
    } else if (this.flush()) {
      return 5;
    } else if (this.straight()) {
      return 4;
    } else if (this.threeKind()) {
      return 3;
    } else if (this.twoPair()) {
      return 2;
    } else if (this.jacksOrBetter()) {
      return 1;
    } else {
      return 0;
    }
  };

  PokerHand.prototype.getCurrentSuits = function() {
    var card, _i, _len, _ref1, _results;
    this.suits = {};
    _ref1 = this.cards;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      card = _ref1[_i];
      _results.push(this.suits[card.suit] = !this.suits[card.suit] ? 1 : this.suits[card.suit]++);
    }
    return _results;
  };

  PokerHand.prototype.getCurrentRanks = function() {
    var card, _i, _len, _ref1, _results;
    this.ranks = {};
    _ref1 = this.cards;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      card = _ref1[_i];
      _results.push(this.ranks[card.rank] = !this.ranks[card.rank] ? 1 : this.ranks[card.rank]++);
    }
    return _results;
  };

  PokerHand.prototype.sameRank = function(n) {
    var rank, _i, _len, _ref1;
    _ref1 = this.ranks;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      rank = _ref1[_i];
      if (rank === n) {
        true;
      }
    }
    return false;
  };

  PokerHand.prototype.royalFlush = function() {
    var rank, _i;
    if (this.flush()) {
      for (rank = _i = 10; _i <= 14; rank = ++_i) {
        if (this.ranks[rank] !== 1) {
          false;
        }
      }
      true;
    }
    return false;
  };

  PokerHand.prototype.straightFlush = function() {
    return this.straight() && this.flush();
  };

  PokerHand.prototype.fourKind = function() {
    return this.sameRank(4);
  };

  PokerHand.prototype.threeKind = function() {
    return this.sameRank(3);
  };

  PokerHand.prototype.pair = function() {
    return this.sameRank(2);
  };

  PokerHand.prototype.fullHouse = function() {
    return this.pair() && this.threeKind();
  };

  PokerHand.prototype.flush = function() {
    var suit, _i, _len, _ref1;
    _ref1 = this.suits;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      suit = _ref1[_i];
      if (suit === 5) {
        true;
      }
    }
    return false;
  };

  PokerHand.prototype.straight = function() {
    var cardsInRow, rank, startingRank, _i, _j, _ref1;
    cardsInRow = 0;
    startingRank = 0;
    for (rank = _i = 2; _i <= 14; rank = ++_i) {
      if (this.ranks[rank] === 1) {
        startingRank = rank;
        break;
      }
    }
    for (rank = _j = startingRank, _ref1 = startingRank + 5; startingRank <= _ref1 ? _j <= _ref1 : _j >= _ref1; rank = startingRank <= _ref1 ? ++_j : --_j) {
      if (this.ranks[rank] === 1) {
        cardsInRow++;
      }
    }
    if (cardsInRow === 5) {
      return true;
    } else {
      return false;
    }
  };

  PokerHand.prototype.twoPair = function() {
    var pairs, rank, _i, _len, _ref1;
    pairs = 0;
    _ref1 = this.ranks;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      rank = _ref1[_i];
      if (rank === 2) {
        pairs++;
      }
    }
    if (pairs === 2) {
      return true;
    } else {
      return false;
    }
  };

  return PokerHand;

})(Deck);
