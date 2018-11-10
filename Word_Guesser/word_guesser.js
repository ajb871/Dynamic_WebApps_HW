var letters_word = ['B','O','O','T']; //array of letters
var letters_guessed = []; //array of user guessed letters
var letters_guessed_correct = ['_','_','_','_'];

var secret_word = letters_word.join(""); //string created from secret letters
var guessed_word = letters_guessed_correct.join(""); //string created from guessed letters

var guesses = 6;
var win = false; //win variable

console.log('use the function "guessLetter()" to make your single letter guesses!');
console.log('you have ' + guesses + ' guesses');

function guessLetter(letter_input){ //argument is guessed letter
    var letter = letter_input.toUpperCase();
    var guess_correct = false; //true or false -> false by default
    var invalid = false; //whether or not 

    //check if letter has already been guessed
    for(var i=0; i < letters_guessed.length; i++){ 
      if(letters_guessed[i] == letter){
        invalid = true; //do not run check if it has been guessed
        console.log('You have already guessed that letter! Try again...');
        break; //break if already guessed
      }
    }

    if (invalid == false && guesses > 0 && win!=true){ //run check if invalid is false (i.e. NOT a repeat), check for enough guesses, and check for win 

      guesses -= 1; //this is one guess

      letters_guessed.push(letter); //add input to ALL guessed letters array

      for(var i=0;i<letters_word.length;i++){ //for each letter in secret word
          if(letter == letters_word[i]){ //if letter is in word
            letters_guessed_correct[i] = letter; //add letter to CORRECT guessed letters
            guessed_word = letters_guessed_correct.join(""); //update string
            guess_correct = true; //run "correct guess" console log
          }//if-close
      }//for-close

      //check if this guess was a winning guess      
      if(guessed_word == secret_word){
        win = true;
        console.log('the letter ' + letter + ' is in the secret word!'); //print before going to congratulations screen
      } else {
        win = false;
      }

      if (win != true){
        if (guess_correct == true){ //correct guess but NOT the winning guess
        //print "success" statement with current guess
        console.log('the letter ' + letter + ' is in the secret word!');
        console.log(guessed_word);
        //how many guesses left?
        console.log('guesses left: '+ guesses); //print guesses
          if(guesses<1) { //tell them if they've lost so they don't guess again
            console.log('Sorry! You have reached your maximum number of guesses!');
            console.log('The secret word was: ' + secret_word);
          }
      }else{ //incorrect guess and NO win
        console.log('the letter ' + letter +' is NOT in the secret word!');
        console.log(guessed_word);
        //how many guesses left?
        console.log('guesses left: '+ guesses); //tell them if they've lost so they don't guess again
          if(guesses<1 & win != true) {
            console.log('Sorry! You have reached your maximum number of guesses!');
            console.log('The secret word was: ' + secret_word);
          }
        }//else-close
      }
    //failure statement
    }else if(guesses < 1 && win!= true){
        console.log('Sorry! You have reached your maximum number of guesses!');
        console.log('The secret word was: ' + secret_word);
    } //else-close

    if(win == true){
      console.log(guessed_word);
      console.log('Congrats! You guessed all the letters! And with ' + guesses + ' guess(es) left!')
    }
}//func-close