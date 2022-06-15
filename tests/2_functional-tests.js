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

});

