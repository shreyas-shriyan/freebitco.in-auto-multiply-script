var start_multiplier = '5';
var repeatCurrent = 0;
var stopped = false;
var startbalance = 0;
var maxWait = 100;
var stopBefore = 1;
var startValue = 0.00000002;

//Button triggers
var $loButton = $('#double_your_btc_bet_lo_button');
var $hiButton = $('#double_your_btc_bet_hi_button');
var $multiply = $('#double_your_btc_2x');
var $divide = $('#double_your_btc_half');

//----------//----------//----------//----------// FUNCTIONS //----------//----------//----------//----------//

//Multiply function ---------------------

function multiply() {
  //Count highest number of rolls played so far
  if (repeatCurrent > maxTries) {
    reset();
    return $lobutton;
  } //reset if reach end of stakes with no win - LOSE MONEY
  //Set stake value based on repeat number (convert # to btc 1 = 0.00000001 btc)
  stake = number[repeatCurrent - 1] * 0.00000001;
  $('#double_your_btc_stake').val(stake.toFixed(8));
  $multiplier.val('5');
  return $hiButton;
} //multiply end -----------------------

function divide() {}

//Get random wait
function getRandomWait() {
  var wait = Math.floor(Math.random() * maxWait) + 200;
  return wait;
}

//Start, Stop and Reset functions
function startGame() {
  reset();
  $loButton.trigger('click');
}

function stopGame() {
  console.log('Game will stop soon! Let me finish.');
  stopped = true;
  fail;
}

function reset(multiplier) {
  repeatCurrent = 0;
}

//Stop before freeroll timer end
function stopBeforeRedirect() {
  var minutes = parseInt($('title').text());
  if (minutes < stopBefore) {
    console.log(
      "Approaching redirect! Stop the game so we don't get redirected while loosing."
    );
    stopGame();
    return true;
  }
  return false;
}

//Get html element id
function id(id) {
  return document.getElementById(id);
}

//Check if bet button clicked
function isBetButtonDisabled(mod) {
  return id('double_your_btc_bet_' + mod + '_button').getAttribute('disabled');
}

//----------//----------//----------//----------// BET TRIGGERING SYSTEM //----------//----------//----------//----------//
//Buttons
$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();

//Checking if win/lost
$('#double_your_btc_bet_lose').bind('DOMSubtreeModified', function (event) {
  if ($(event.currentTarget).is(':contains("lose")')) {
    //Previous bet was lost
    //Call multiply fn using variable, after random wait
    var btn = multiply();
    setTimeout(function () {
      btn.trigger('click');
    }, getRandomWait());
  }
});

$('#double_your_btc_bet_win').bind('DOMSubtreeModified', function (event) {
  if ($(event.currentTarget).is(':contains("win")')) {
    //Previous bet was won
    //Stop if near reload
    if (stopBeforeRedirect()) {
      return;
    }
    //Reload page if rolled close to max
    if (rollsmax > maxTries - 2) {
      window.location.reload();
      reset();
      startGame();
    }

    //Reset and start game again
    reset();
    var btn = multiply();
    setTimeout(function () {
      btn.trigger('click');
    }, getRandomWait());
  }
});

//Check button clicked and change seed - update rollstats
function init(mod) {
  if (isBetButtonDisabled(mod) == 'disabled') {
    isBetButtonClicked = true;
    return;
  } else {
    if (isBetButtonClicked === true) {
      isBetButtonClicked = false;
    } else {
      return;
    }
  }
}

id('double_your_btc_bet_hi_button').addEventListener(
  'DOMSubtreeModified',
  function () {
    init('hi');
  }
);

id('double_your_btc_bet_lo_button').addEventListener(
  'DOMSubtreeModified',
  function () {
    init('lo');
  }
);

//----------------//----------------// START //--------------//----------------//---------------//----------------//------------------------------------------------

startGame();
