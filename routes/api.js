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
      if (!solver.validate(req.body.puzzle)) res.json({error:"Expected puzzle to be 81 characters long"});
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
      let bufferArr=req.body.puzzle.split("");
      let input = req.body.puzzle
      if(!solver.validate(input)) res.json({error:"Expected puzzle to be 81 characters long"});
      

      else {
        for(let i=0;i<9;i++){
          for (let j=0;j<9;j++){
            if(bufferArr[i*9+j]==='.'){
            for( let num=1;num<10;num++){
              
                if(solver.checkRowPlacement(input,i,num) && solver.checkColPlacement(input,j,num) && solver.checkRegionPlacement(input,[i,j],num)){
                  bufferArr[i*9+j]=num;
                  console.log(num);
                  input=bufferArr.join('');
                }
                
            }
            }
          }
        }
        console.log(input);
      }
      res.json({solution:input});
    });
};
