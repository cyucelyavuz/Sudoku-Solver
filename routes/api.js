'use strict';

const { response } = require('express');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  

  function indexize (coordinate){
    let index = coordinate.split("");
    index[0]=index[0].toUpperCase();
   // console.log(String.fromCharCode(index[0].charCodeAt(0)-17));
    index[0]=Number(String.fromCharCode(index[0].charCodeAt(0)-17));
    index[1]=Number(index[1])-1;
   //console.log(index);
    return index;
  }


  app.route('/api/check')
    .post((req, res) => {
      const coordinateReg=/[a-zA-Z]{1}\d{1}/;
      const valueReg=/\d{1}|\.{1}/;
      
      
      if (solver.validate(req.body.puzzle)!==true) res.json(solver.validate(req.body.puzzle));
      if(!req.body.coordinate || !req.body.value) res.json({error:"Required field(s) missing"});
      if (!coordinateReg.test(req.body.coordinate)) res.json({error:'Invalid coordinate'});
      if(!valueReg.test(req.body.value)) res.json({error:'Invalid value'})
      if(solver.validate(req.body.puzzle) && 
          req.body.coordinate && 
          req.body.value &&
          coordinateReg.test(req.body.coordinate)&&
          valueReg.test(req.body.value)){
        let responseObj={
          valid:true,
          conflict:[]
        }

        const index=indexize(req.body.coordinate);
        let puzzlesArr= req.body.puzzle.split('');
        if (puzzlesArr[index[0]*8+index[1]]!=='.') puzzlesArr[index[0]*8+index[1]]='.';
        const puzzleString=puzzlesArr.join('');
        //console.log(puzzleString);

        if(!solver.checkRowPlacement(puzzleString,index[0],req.body.value)) {
          responseObj.valid=false;
          responseObj.conflict.push("row");
        }
        if(!solver.checkColPlacement(puzzleString,index[1],req.body.value)){
          responseObj.valid=false;
          responseObj.conflict.push("column");
        }
        if(!solver.checkRegionPlacement(puzzleString,index,req.body.value)){
          responseObj.valid=false;
          responseObj.conflict.push("region");
        }
        
        (responseObj.valid) ? res.json({valid:responseObj.valid}) : res.json(responseObj);
        
    }
 });
    
  app.route('/api/solve')
    .post((req, res) => {
      //if(!req.body.puzzle) req.body.puzzle='.................................................................................'
      if (!req.body.puzzle) res.json({error: 'Required field missing'});
      let response;
      if(solver.validate(req.body.puzzle)!==true) res.json(solver.validate(req.body.puzzle));
      else{
        response= solver.solve_mod(req.body.puzzle);
        //console.log(solver.solve_mod(req.body.puzzle));
      }

   
        
       
      if(response==='failed to solve') res.json({ error: 'Puzzle cannot be solved' });
      else res.json({solution:response});
    });
};
