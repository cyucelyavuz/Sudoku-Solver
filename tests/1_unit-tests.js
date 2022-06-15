const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver =  new Solver();



const testStrings = require("../controllers/puzzle-strings");

suite('UnitTests', () => {
    
    test('handle a string with 81 characters', (done)=>{
        const puzzleString = testStrings[0][0];
        assert.lengthOf(puzzleString,81);
        assert.isTrue(solver.validate(puzzleString));
        done();
    });

    test('handle a puzzle string with invalid characters (not 1-9 or .)',(done)=>{
      const invalidString="1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37q";
      assert.deepEqual(solver.validate(invalidString),{error:"Invalid characters in puzzle"});
      done();
    });

    test('handle a puzzle string that is not 81 characters in length',(done)=>{
      const invalidString="1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37..";
      assert.deepEqual(solver.validate(invalidString),{error:"Expected puzzle to be 81 characters long"});
      done();
    });

    test('handle a valid row placement',(done)=>{
      const puzzleString = testStrings[0][0];  //A2  3 
      assert.isTrue(solver.validate(puzzleString));
      assert.isTrue(solver.checkRowPlacement(puzzleString,'0','3'));
      done();
    });

    test('handle an invalid row placement',(done)=>{
      const puzzleString = testStrings[0][0];
      assert.isTrue(solver.validate(puzzleString));
      assert.isFalse(solver.checkRowPlacement(puzzleString,'0','2'));
      done();
    });

    test('handle a valid column placement',(done)=>{
      const puzzleString = testStrings[1][0];
      assert.isTrue(solver.validate(puzzleString));
      assert.isTrue(solver.checkColPlacement(puzzleString,'0','1'));
      done();
    });

    test('handle an invalid column placement',(done)=>{
      const puzzleString = testStrings[1][0];
      assert.isTrue(solver.validate(puzzleString));
      assert.isFalse(solver.checkColPlacement(puzzleString,'0','3'));
      done();
    });

    test('handle a valid region (3x3 grid) placement',(done)=>{
      const puzzleString = testStrings[1][0];
      assert.isTrue(solver.validate(puzzleString));
      assert.isTrue(solver.validate(puzzleString,[4,0],'2'));
      done();
    });

    test('handle an invalid region (3x3 grid) placement',(done)=>{
      const puzzleString = testStrings[1][0];
      assert.isTrue(solver.validate(puzzleString));
      assert.isFalse(solver.checkRegionPlacement(puzzleString,[4,0],'8'));
      done();
    });


    test('puzzle strings pass the solver',(done)=>{
      const puzzleString=testStrings[1][0];
      const solutionString=testStrings[1][1];

      assert.isTrue(solver.validate(puzzleString));
      assert.equal(solver.solve_mod(puzzleString),solutionString);
      done();
    });

    test('invalid puzzle strings fail the solver',(done)=>{
      const invalidString="1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37..";
      assert.deepEqual(solver.validate(invalidString),{error:"Expected puzzle to be 81 characters long"});
      done();
    });

    test('solver returns the expected solution for an incomplete puzzle',(done)=>{
      const puzzleString=testStrings[2][0];
      const solutionString=testStrings[2][1];
      assert.isTrue(solver.validate(puzzleString));
      assert.equal(solver.solve_mod(puzzleString),solutionString);
      done();
    });
});
