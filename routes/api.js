'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const valid = solver.validate(req.body.puzzle);
      console.log(valid);
    });
    
  app.route('/api/solve')
    .post((req, res) => {

    });
};
