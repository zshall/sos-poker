/*globals Kinetic, Image, PokerDeck, document*/

// PRESENTATION CODE
Array.prototype.randomItem = function() {
    return this[Math.floor(Math.random()*this.length)];
};

var stage = new Kinetic.Stage({
    container: 'game',
    width: 504,
    height: 360
});

var suits = {
    hearts: [{"x":37,"y":2,"width":33,"height":39}],
    spades: [{"x":2,"y":2,"width":33,"height":39}],
    diamonds: [{"x":72,"y":2,"width":33,"height":39}],
    clubs: [{"x":107,"y":2,"width":33,"height":39}],
    blank: [{"x":142,"y":2,"width":33,"height":39}]
};

var ranks = {
    a: [{"x":353,"y":2,"width":42,"height":35}],
    2: [{"x":705,"y":2,"width":42,"height":35}],
    3: [{"x":661,"y":2,"width":42,"height":35}],
    4: [{"x":617,"y":2,"width":42,"height":35}],
    5: [{"x":573,"y":2,"width":42,"height":35}],
    6: [{"x":529,"y":2,"width":42,"height":35}],
    7: [{"x":485,"y":2,"width":42,"height":35}],
    8: [{"x":441,"y":2,"width":42,"height":35}],
    9: [{"x":397,"y":2,"width":42,"height":35}],
    10: [{"x":749,"y":2,"width":42,"height":35}],
    j: [{"x":265,"y":2,"width":42,"height":35}],
    q: [{"x":221,"y":2,"width":42,"height":35}],
    k: [{"x":177,"y":2,"width":42,"height":35}],
    blank: [{"x":309,"y":2,"width":42,"height":35}]
};

var system = {
    0: [{"x":2,"y":67,"width":23,"height":22}],
    1: [{"x":77,"y":43,"width":23,"height":22}],
    2: [{"x":127,"y":43,"width":23,"height":22}],
    3: [{"x":2,"y":43,"width":23,"height":22}],
    4: [{"x":27,"y":43,"width":23,"height":22}],
    5: [{"x":202,"y":43,"width":23,"height":22}],
    6: [{"x":227,"y":43,"width":23,"height":22}],
    7: [{"x":52,"y":43,"width":23,"height":22}],
    8: [{"x":152,"y":43,"width":23,"height":22}],
    9: [{"x":177,"y":43,"width":23,"height":22}],
    gameover_off: [{"x":2,"y":32,"width":123,"height":9}],
    gameover_on: [{"x":127,"y":32,"width":123,"height":9}, {"x":2,"y":32,"width":123,"height":9}],
    draw_off: [{"x":2,"y":2,"width":122,"height":8}],
    draw_on: [{"x":126,"y":2,"width":122,"height":8}, {"x":2,"y":2,"width":122,"height":8}],
    overflow_off: [{"x":2,"y":12,"width":145,"height":8}],
    overflow_on: [{"x":2,"y":22,"width":145,"height":8}],
    win_off: [{"x":27,"y":67,"width":77,"height":26}],
    win_on: [{"x":106,"y":67,"width":77,"height":26}, {"x":27,"y":67,"width":77,"height":26}],
    awe_off: [{"x":185,"y":67,"width":32,"height":32}],
    awe_on: [{"x":219,"y":67,"width":32,"height":32}, {"x":185,"y":67,"width":32,"height":32}],
    held_off: [{"x":149,"y":12,"width":44,"height":8}],
    held_on: [{"x":195,"y":12,"width":44,"height":8}],
    blank: [{"x":102,"y":43,"width":23,"height":22}]
};

var layer = new Kinetic.Layer();
var cardsImg = new Image();
var systemImg = new Image();
var cards = {};
var scoreboard = {};

function CardView (index) {
    cards[index] = {};
    var spacing = 84;
    
    cards[index].suit = new Kinetic.Sprite({
        x: 45+index*spacing, // 45
        y: 185, // 185
        image: cardsImg,
        animation: 'blank',
        animations: suits,
        frameRate: 1
    });
    
    cards[index].rank = new Kinetic.Sprite({
        x: 80+index*spacing, // 80
        y: 190, // 190
        image: cardsImg,
        animation: 'blank',
        animations: ranks,
        frameRate: 1
    });
    
    cards[index].held = new Kinetic.Sprite({
        x: 78+index*spacing,
        y: 180,
        image: systemImg,
        animation: 'held_off',
        animations: system,
        frameRate: 1
    });
    
    layer.add(cards[index].suit);
    layer.add(cards[index].rank);
    layer.add(cards[index].held);
}

cardsImg.onload = function() {
    // initialize 5 cards
    for (var i = 0; i < 5; i++) {
        CardView(i);
        //[i].rank.setAnimation(['a', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'j', 'q', 'k'].randomItem());
        //cards[i].suit.setAnimation(['spades', 'hearts', 'clubs', 'diamonds'].randomItem());
        //cards[i].held.setAnimation(['held_off', 'held_on'].randomItem());
    }
   
    //stage.add(cardLayer);
    cards[0].rank.setAnimation(3);
    
    var deck = new PokerDeck(true);
    var hand = deck.dealHand();
//print(deck.dealHand());

    for (var j = 0; j < hand.cards.length; j++) {
        //cards[i].rank.setAnimation(hand.cards[i].rank);
        //cards[i].suit.setAnimation(hand.cards[i].suit);
    }
};

systemImg.onload = function() {
    // initialize scoreboard
    for (var i = 0; i < 5; i++) {
        scoreboard[i] = new Kinetic.Sprite({
            x: 315+i*30,
            y: 140,
            image: systemImg,
            animation: 'blank',
            animations: system
        });
        //scoreboard[i].setAnimation(i);
        layer.add(scoreboard[i]);
    }
    
    scoreboard.overflow = new Kinetic.Sprite({
        x: 313, y: 165, animation: 'overflow_off',
        image: systemImg, animations: system,
    });
    layer.add(scoreboard.overflow);
    
    scoreboard.holdOrDraw = new Kinetic.Sprite({
        x: 50, y: 140, frameRate: 2, animation: 'draw_off',
        image: systemImg, animations: system,
    });
    layer.add(scoreboard.holdOrDraw);
    scoreboard.holdOrDraw.start();
    
    scoreboard.gameover = new Kinetic.Sprite({
        x: 50, y: 160, frameRate: 1, animation: 'gameover_on',
        image: systemImg, animations: system,
    });
    layer.add(scoreboard.gameover);
    scoreboard.gameover.start();
    
    scoreboard.win = new Kinetic.Sprite({
        x: 180, y: 140, frameRate: 3, animation: 'win_off',
        image: systemImg, animations: system,
    });
    layer.add(scoreboard.win);
    scoreboard.win.start();
    
    scoreboard.awe = new Kinetic.Sprite({
        x: 270, y: 137, frameRate: 1, animation: 'awe_off',
        image: systemImg, animations: system,
    });
    layer.add(scoreboard.awe);
    scoreboard.awe.start();
    
    stage.add(layer);
    
    // initialize other elements
    cardsImg.src = 'img/cards.png';
};

systemImg.src = 'img/system.png';

function print (message) {
    document.getElementById('messages').innerHTML += message + "<br/>";
}
