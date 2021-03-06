
/*
 *
 *
The function "makeMove" is already written for you.
You do not need to modify it, but you should read it.

It will choose moves intelligently once minimax,
which it invokes, evaluates different board-states
correctly.  It is the ONLY function invoked when
you play against the computer after starting up
the server.

Input: A state object, representing the Connect 4 board.

Output: Returns an integer indicating the column
where the piece will be dropped.

*/

const makeMove = (state) => {

	// Find whose move it is; 'x' or 'o'
	const playerMoving = state.nextMovePlayer;

	// state.legalMoves returns an array of integer values,
	// which indicate the locations (0 through 6)
	// where one can currently legally drop a piece.
	const allLegalMoves = state.legalMoves();

	// To get a successor state following a move,
	// just call state.move(someMove).  This returns
	// the board state after that move has been made.
	// It autmatically switches the player whose
	// move it is, adds the piece to the board, etc.
	//
	// Note that state is immutable; invoking state.move
	// does NOT change the original state, but
	// returns a new one.
	const newState = state.move(allLegalMoves[0]);


	// The following is the guts of the make-move function.
	// It evaluates each possible successor state with
	// minimax, and performs the move that leads to the best
	// state.
	const depth = 4;

	let bestMoveIndex = null;
	let bestMoveValue = null;
	allLegalMoves.forEach( (legalMove, i) => {

		const potentialState = state.move(legalMove)

		// Sets the playerMoving to be the maximizer.
		// This variable gets handed down in the recursive
		// minimax call unchanged.

        // const stateValue = minimax(potentialState, depth, playerMoving);
        const stateValue = minimaxAlphaBetaWrapper(potentialState, depth, playerMoving)

		if (stateValue > bestMoveValue || bestMoveValue === null){
			bestMoveIndex = i;
			bestMoveValue = stateValue;
		}

	});
	return allLegalMoves[bestMoveIndex]

}



/*
You must write the function "heuristic".

Input: state, maximizingPlayer.  The state will be
a state object.  The maximizingPlayer will be either
an 'x' or an 'o', and is the player whose advantage
is signified by positive numbers.

Output: A number evaluating how good the state is from
the perspective of the player who is maximizing.

A useful method on state here would be state.numLines.
This function takes an integer and a player
like this "state.numLines(2,'x')" and returns the
number of lines of that length which that player
has.  That is, it returns the number of contiguous linear
pieces of that length that that player has.

You'll want to pass the tests defined in minimax_specs.js.
*/
const heuristic = (state, maximizingPlayer) => {

    // console.log('==================')
    // console.log(state)

	//This is how you can retrieve the minimizing player.
    const minimizingPlayer = (maximizingPlayer == 'x') ? 'o' : 'x';

	//An example.
    const linesOfLengthTwoForX = state.numLines(2, 'x')

    //Your code here.  Don't return random, obviously.
	let h = 0;
    for (let i = state.winning; i > 1; i--) {      
        h += i*i*i*i*i * (
            state.numLines(i, maximizingPlayer) - 
            state.numLines(i, minimizingPlayer)
        )
    }
    
    // console.log(h);
    return h;
}



/*
You must write the function "minimax".

Input: state, depth, maximizingPlayer.  The state is
an instance of a state object.  The depth is an integer
greater than zero; when it is zero, the minimax function
should return the value of the heuristic function.

Output: Returns a number evaluating the state, just
like heuristic does.

You'll need to use state.nextStates(), which returns
a list of possible successor states to the state passed in
as an argument.

You'll also probably need to use state.nextMovePlayer,
which returns whether the next moving player is 'x' or 'o',
to see if you are maximizing or minimizing.
*/
const minimax = (state, depth, maximizingPlayer) => {
    // console.log('minimax', depth)
	var possibleStates = state.nextStates();
	var currentPlayer = state.nextMovePlayer;
    
    if (depth === 0 || !possibleStates.length)
        return heuristic(state, maximizingPlayer);
        
    if (currentPlayer === maximizingPlayer) {
        let x = possibleStates.reduce((max, curState) => {
            let cur = minimax(curState, depth-1, maximizingPlayer)
            return (max > cur) ? max : cur;
        }, -10000000);
        
        return x
    } else {
        let x = possibleStates.reduce((min, curState) => {
            let current = minimax(curState, depth-1, maximizingPlayer)
            return (min > current) ? current : min;
        }, 10000000);
        
        return x
    }
}

/* minimaxAlphaBetaWrapper is a pre-written function, but it will not work
   unless you fill in minimaxAB within it.

   It is called with the same values with which minimax itself is called.*/
const minimaxAlphaBetaWrapper = (state, depth, maximizingPlayer) => {

    /*
    You will need to write minimaxAB for the extra credit.
    Input: state and depth are as they are before.  (Maximizing player
    is closed over from the parent function.)

    Alpha is the BEST value currently guaranteed to the maximizing
    player, if they play well, no matter what the minimizing player
    does; this is why it is a very low number to start with.

    Beta is the BEST value currently guaranteed to the minimizing
    player, if they play well, no matter what the maximizing player
    does; this is why it is a very high value to start with.
	*/
	const minimaxAB = (state, depth, alpha, beta) => {
        // console.log('minimax', depth)
    	var possibleStates = state.nextStates();
    	var currentPlayer = state.nextMovePlayer;
    
        if (depth == 0 || !possibleStates.length)
            return heuristic(state, maximizingPlayer);
        
        if (currentPlayer === maximizingPlayer) {
            let x = possibleStates.reduce((max, curState) => {
                alpha = (max > alpha) ? max : alpha;
                if (alpha > beta) return max;
                
                let cur = minimax(curState, depth-1, maximizingPlayer)
                return (max > cur) ? max : cur;
            }, -10000000);
        
            return x
        } else {
            let x = possibleStates.reduce((min, curState) => {
                beta = (min < beta) ? min : beta;
                if (alpha > beta) return min;
                
                let current = minimax(curState, depth-1, maximizingPlayer)
                return (min > current) ? current : min;
            }, 10000000);
        
            return x
        }
	}

	return minimaxAB(state, depth, -100000, 100000);
}

module.exports = {makeMove, minimax, heuristic};
