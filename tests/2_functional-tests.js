const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const testStrings = require("../controllers/puzzle-strings");
chai.use(chaiHttp);

suite('Functional Tests', () => {

    test('Solve a puzzle with valid puzzle string',(done)=>{
        chai.request(server)
            .post('/api/solve')
            .type('form')
            .send({
                puzzle:testStrings[0][0]
            })
            .end((err,res)=>{
                if (err) console.log(err);
                else {
                    assert.equal(res.status,200);
                    assert.equal(res.body.solution,testStrings[0][1]);
                    done();
                }
            })
    });

    test('Solve a puzzle with missing puzzle string',(done)=>{
        chai.request(server)
            .post('/api/solve')
            .type('form')
            .send({})
            .end((err,res)=>{
                if (err) console.log(err)
                else{                
                    assert.equal(res.status,200);
                    assert.equal(res.body.error,'Required field missing');
                    done();
                }
            })
    });

    test('Solve a puzzle with invalid characters',(done)=>{
        chai.request(server)
            .post('/api/solve')
            .type('form')
            .send({
                puzzle:'fuckUpString3.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
            })
            .end((err,res)=>{
                if (err) console.log(err)
                else{
                    assert.equal(res.status,200);
                    assert.equal(res.body.error,"Invalid characters in puzzle");
                    done();
                }
            })
    });


    test('Solve a puzzle with incorrect length',(done)=>{
        chai.request(server)
            .post('/api/solve')
            .type('form')
            .send({
                puzzle:testStrings[0][1]+'2'
            })
            .end((err,res)=>{
                if (err) console.log(err)
                else{
                    assert.equal(res.status,200);
                    assert.equal(res.body.error,"Expected puzzle to be 81 characters long");
                    done();
                }
            })
    });

    test('Solve a puzzle that cannot be solved',(done)=>{
        chai.request(server)
            .post('/api/solve')
            .type('form')
            .send({
                puzzle:testStrings[0][0].replace('.','1')
            })
            .end((err,res)=>{
                if (err) console.log(err)
                else{
                    assert.equal(res.status,200);
                    assert.equal(res.body.error,'Puzzle cannot be solved');
                    done();
                }
            })
    });

    test('Check a puzzle placement with all fields',(done)=>{
        chai.request(server)
            .post('/api/check')
            .type('form')
            .send({
                puzzle:testStrings[0][0],
                coordinate:'A1',
                value:'7'
            })
            .end((err,res)=>{
                if (err) console.log(err)
                else{
                    assert.equal(res.status,200);
                    assert.equal(res.body.valid,true);
                    assert.lengthOf(res.body.conflict,0);
                    done();
                }
            })
    });


    test('Check a puzzle placement with single placement conflict',(done)=>{
        chai.request(server)
            .post('/api/check')
            .type('form')
            .send({
                puzzle:testStrings[0][0],
                coordinate:'A1',
                value:'6'
            })
            .end((err,res)=>{
                if (err) console.log(err)
                else{
                    assert.equal(res.status,200);
                    assert.equal(res.body.valid,false);
                    assert.lengthOf(res.body.conflict,1);
                    assert.equal(res.body.conflict[0],"region");
                    done();
                }
            })
    });


    test('Check a puzzle placement with multiple placement conflicts',(done)=>{
        chai.request(server)
            .post('/api/check')
            .type('form')
            .send({
                puzzle:testStrings[0][0],
                coordinate:'A2',
                value:'6'
            })
            .end((err,res)=>{
                if (err) console.log(err)
                else{
                    assert.equal(res.status,200);
                    assert.equal(res.body.valid,false);
                    assert.lengthOf(res.body.conflict,2);
                    assert.deepEqual(res.body.conflict,[ "column","region" ]);
                    done();
                }
            })
    });

    test('Check a puzzle placement with all placement conflicts',(done)=>{
        chai.request(server)
            .post('/api/check')
            .type('form')
            .send({
                puzzle:testStrings[0][0],
                coordinate:'A2',
                value:'2'
            })
            .end((err,res)=>{
                if (err) console.log(err)
                else{
                    assert.equal(res.status,200);
                    assert.equal(res.body.valid,false);
                    assert.lengthOf(res.body.conflict,3);
                    assert.deepEqual(res.body.conflict,['row','column','region']);
                    done();
                }
            })
    });


    test('Check a puzzle placement with missing required fields',(done)=>{
        chai.request(server)
            .post('/api/check')
            .type('form')
            .send({
                puzzle:testStrings[0][0],
                coordinate:'A2'
            })
            .end((err,res)=>{
                if (err) console.log(err)
                else{
                    assert.equal(res.status,200);
                    assert.equal(res.body.error,"Required field(s) missing");
                    done();
                }
            })
    });


    test('Check a puzzle placement with missing required fields',(done)=>{
        chai.request(server)
            .post('/api/check')
            .type('form')
            .send({
                puzzle:testStrings[0][0],
                coordinate:'A2'
            })
            .end((err,res)=>{
                if (err) console.log(err)
                else{
                    assert.equal(res.status,200);
                    assert.equal(res.body.error,"Required field(s) missing");
                    done();
                }
            })
    });

});

