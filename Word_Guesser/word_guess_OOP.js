//Create Object for secret words
//using class syntax
class Secret_Word{
  constructor(word){ //constructor accepts the word
    this.word = word; //string
    this.length = word.length; //length of string
  }//cnstcr

  //Create function for guessing letters
  guessLetter(letter){
    letter = letter.toUpperCase();
    //Check the string for the guessed letter
    for(var i=0; i<this.length; i++){
      if(letter == this.word[i]){
        letters_correct[i] = this.word[i]; //put letter to correct letters array
        return true;
        break;//Only loop until a match is found
      }
    }
  }//method
}//class

//Create LIST to store secret words:
var word_list = ['SOCKS','FERN','DOOR','DARK','ART','SOUP','RAT'];

//Using a For loop - Create a Secret_Word object from each word in the array, and then store those objects BACK into the array
for(var i=0; i< word_list.length; i++){
  word_list[i] = new Secret_Word(word_list[i], word_list[i].length);
}

//Select this round's secret word using random no. generation and word list length
var random = Math.floor(Math.random() * word_list.length);
var secret_word = word_list[random];

//Create array of all letters guessed
var letters_guessed = []; 
//Create array of all CORRECT letters guessed
var letters_correct = [];
//Fill CORRECT letters guessed with blank spaces
for(var i=0; i<secret_word.length; i++){
  letters_correct.push('_');
}

//Create var for 8 guesses allowed
var guesses = 8;
//Create var for Winning
var win = false;
//Create var for invalid guesses/events
var invalid = false;

function guessLetter(letter){
  invalid = false; //reset invalid variable

  if(letters_guessed.includes(letter)){
    invalid = true;
    console.log('You already guessed that letter!'  + "\n");
  }

  if(invalid === false && win != true && guesses > 0){
    letters_guessed.push(letter); //push to guessed letters array

    if(word_list[random].guessLetter(letter)){
      console.log('Correct! The letter ' + letter + ' is in the secret word!');
      console.log(letters_correct.join("")); //print string of correct guesses
    } else {
      console.log('Incorrect! The letter ' + letter + ' is NOT in the secret word!');
    }//if
    guesses --;

    //Determine if they have won or not by comparing strings
    if(secret_word.word === letters_correct.join("")){
      win = true;
    }

    //Track guesses if they didn't win
    if (win != true){
      if(guesses <= 0){
        console.log('Sorry! That was all of your guesses. The secret word was: ' + secret_word.word  + "\n");
      } else {
        console.log(guesses + ' guess(es) left!' + "\n");
      }
    } else{
      console.log('Congrats! You guessed the secret word!');
    }//if
  }//if

}

guessLetter('a');
guessLetter('a'); //double guess
guessLetter('f');
guessLetter('r');
guessLetter('t');
guessLetter('e');
guessLetter('o');
guessLetter('s'); 
guessLetter('k'); //8th guess
guessLetter('u'); //9th guess (extra)