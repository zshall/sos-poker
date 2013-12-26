Array.prototype.shuffle = ->
    counter = this.length
    temp = undefined
    index = undefined
  
    # While there are elements in the array
    while counter > 0
        # Pick a random index
        index = Math.floor(Math.random() * counter)
        
        # Decrease counter by 1
        counter--
        
        # And swap the last element with it
        temp =this[counter]
        this[counter] = this[index]
        this[index] = temp

d_suits =
    0:'spades',
    1:'clubs',
    2:'hearts',
    3:'diamonds'

d_ranks =
    2:'2',
    3:'3',
    4:'4',
    5:'5',
    6:'6',
    7:'7',
    8:'8',
    9:'9',
    10:'10',
    11:'j',
    12:'q',
    13:'k',
    14:'a'

d_bet_multiplier =
    0:0,
    1:0.5,
    2:3,
    3:7,
    4:15,
    5:30,
    6:100,
    7:150,
    8:400,
    9:5000

class Card
    constructor: (suit, rank) ->
        @held = false
        @suit = suit
        @rank = rank
    toString: -> "#{@held}\t#{d_ranks[@rank]} of #{d_suits[@suit]}"

class Deck
    constructor: (shuffle) ->
        @cards = []
        for suit in [0..3]
            for rank in [2..14]
                @cards.push new Card(suit, rank)
        if shuffle then @shuffle()
    toString: ->
        o = ''
        for card in @cards
            o += "#{card}\t\n"
        o
    shuffle: -> @cards.shuffle()
    popCard: -> @cards.pop()

class PokerDeck extends Deck
    dealHand: ->
        hand = new PokerHand(this)
        for i in [0..4]
            card = @popCard()
            hand.cards.push card
        hand

class PokerHand extends Deck
    constructor: (parent, cards=[]) ->
        @parent = parent
        @cards = []
        for card in cards
            @cards.push card
        @getCurrentRanks()
        @getCurrentSuits()
    
    toggleHold: (cardIndex) ->
        if @cards[cardIndex].held then @cards[cardIndex].held = false
        else @cards[cardIndex].held = true
    
    draw: ->
        for i in [0..@cards.length-1]
            card = @cards[i]
            if !card.held
                @parent.cards.splice 0, 0, @cards.splice(i, 1)
                @cards.splice 1, 0, @parent.popCard()
    
    determinePokerHand: ->
        @getCurrentRanks()
        @getCurrentSuits()
        if @royalFlush() then 9
        else if @straightFlush() then 8
        else if @fourKind() then 7
        else if @fullHouse() then 6
        else if @flush() then 5
        else if @straight() then 4
        else if @threeKind() then 3
        else if @twoPair() then 2
        else if @jacksOrBetter() then 1
        else 0
    
    getCurrentSuits: ->
        @suits = {}
        for card in @cards
            @suits[card.suit] = if !@suits[card.suit] then 1 else @suits[card.suit]++
    
    getCurrentRanks: ->
        @ranks = {}
        for card in @cards
            @ranks[card.rank] = if !@ranks[card.rank] then 1 else @ranks[card.rank]++
    
    sameRank: (n) ->
        for rank in @ranks
            if rank == n then true
        false
    
    royalFlush: ->
        if @flush()
            for rank in [10..14]
                if @ranks[rank] != 1 then false
            true
        false
    
    straightFlush: -> @straight() and @flush()
    fourKind: -> @sameRank 4
    threeKind: -> @sameRank 3
    pair: -> @sameRank 2
    fullHouse: -> @pair() and @threeKind()
    
    flush: ->
        for suit in @suits
            if suit == 5 then true
        false
    
    straight: ->
        cardsInRow = 0
        startingRank = 0
        for rank in [2..14]
            if @ranks[rank] == 1
                startingRank = rank
                break
        for rank in [startingRank..startingRank+5]
            if @ranks[rank] == 1 then cardsInRow++
        if cardsInRow == 5 then true else false
    
    twoPair: ->
        pairs = 0
        for rank in @ranks
            if rank == 2 then pairs++
        if pairs == 2 then true else false
