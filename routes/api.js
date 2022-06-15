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
      
      
      
      if (!solver.validate(req.body.puzzle)) res.json(solver.validate(req.body.puzzle));
        else if(!req.body.coordinate || !req.body.value) res.json({error:"Required field(s) missing"});
          
      else{
        let responseObj={
          valid:true,
          conflict:[]
        }

        const index=indexize(req.body.coordinate);

        if(!solver.checkRowPlacement(req.body.puzzle,index[0],req.body.value)) {
          responseObj.valid=false;
          responseObj.conflict.push("row");
        }
        if(!solver.checkColPlacement(req.body.puzzle,index[1],req.body.value)){
          responseObj.valid=false;
          responseObj.conflict.push("column");
        }
        if(!solver.checkRegionPlacement(req.body.puzzle,index,req.body.value)){
          responseObj.valid=false;
          responseObj.conflict.push("region");
        }
        res.json(responseObj);
    }
 });
    
  app.route('/api/solve')
    .post((req, res) => {
      if(!req.body.puzzle) req.body.puzzle='.................................................................................'
      let response;
      if(solver.validate(req.body.puzzle)!==true) res.json(solver.validate(req.body.puzzle));
      else{
        response= solver.solve_mod(req.body.puzzle);
        //console.log(solver.solve_mod(req.body.puzzle));
      }

   
        
       
    
      res.json({solution:response});
    });
};
