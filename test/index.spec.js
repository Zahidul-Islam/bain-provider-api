process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

const Provider = require('../model/provider');

if (process.env.NODE_ENV !== 'production' || process.env.TravisCI) {
  require('dotenv').config();
}

const DB_URL = process.env.DB_URL;

mongoose.Promise = global.Promise;
mongoose.connect(DB_URL, { useMongoClient: true });

chai.use(chaiHttp);

describe('Provider', () => {
  before(done => {
    Provider.findOne()
      .then(provider => {
        if (!provider) {
          console.log('Provider', provider)
          console.log('Database not found! Please run `npm run sync` in your terminal.');
          process.exit(-1);
          done();
        }
      });
      done();
  });

  describe('GET /providers', () => {
    it('GET all', (done) => {
      chai.request(server)
        .get('/providers')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.equal(163061)
          done();
        });
    });

    it('GET /providers?min_discharges', done => {
      chai.request(server)
        .get('/providers?min_discharges=6')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.equal(163061)
          res.body[0]['Total Discharges'].should.be.gte(6);
          done();
        });
    });

    it('GET /providers?max_discharges', done => {
      chai.request(server)
        .get('/providers?max_discharges=60')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0]['Total Discharges'].should.be.lte(60);
          done();
        });
    });

    it('GET /providers?min_discharges&max_discharges', done => {
      chai.request(server)
        .get('/providers?min_discharges=499&max_discharges=500')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0]['Total Discharges'].should.be.gte(499);
          res.body[0]['Total Discharges'].should.be.lte(500);
          res.body.length.should.be.equal(2);
          done();
        });
    });

    it('GET /providers?min_discharges&min_average_covered_charges', done => {
      chai.request(server)
        .get('/providers?min_discharges=6&min_average_covered_charges=100000')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0]['Average Covered Charges'].should.be.gte(100000);
          res.body.length.should.be.equal(7913);
          done();
        });
    });


    it('GET /providers?min_discharges&max_average_covered_charges', done => {
      chai.request(server)
        .get('/providers?min_discharges=6&max_average_covered_charges=100000')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0]['Average Covered Charges'].should.be.lte(100000);
          done();
        });
    });

    it('GET /providers?min_discharges&max_average_covered_charges&min_average_covered_charges', done => {
      chai.request(server)
        .get('/providers?min_discharges=6&max_average_covered_charges=5000&min_average_covered_charges=4999')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0]['Average Covered Charges'].should.be.gte(4999);
          res.body[0]['Average Covered Charges'].should.be.lte(5000);
          res.body.length.should.be.equal(1);
          done();
        });
    });

    it('GET /providers?min_discharges&max_average_covered_charges&min_average_covered_charges&min_average_medicare_payments', done => {
      chai.request(server)
        .get(`/providers?min_discharges=6&max_average_covered_charges=6000&min_average_covered_charges=5000&min_average_medicare_payments=1000`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.equal(695);
          res.body[0]['Average Medicare Payments'].should.be.gte(1000);
          res.body[0]['Average Medicare Payments'].should.be.lte(5000);
          done();
        });
    });

    it('GET /providers?min_discharges&max_average_covered_charges&min_average_covered_charges&max_average_medicare_payments', done => {
      chai.request(server)
        .get(`/providers?min_discharges=6&max_average_covered_charges=5000&min_average_covered_charges=4990&max_average_medicare_payments=10000`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.equal(7);
          res.body[0]['Average Covered Charges'].should.be.gte(4990);
          res.body[0]['Average Covered Charges'].should.be.lte(5000);
          res.body[0]['Average Medicare Payments'].should.be.lte(10000);
          done();
        });
    });

    it('GET /providers?min_discharges&min_average_medicare_payments', done => {
      chai.request(server)
        .get(`/providers?min_discharges=6&min_average_medicare_payments=1000`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.equal(163061);
          res.body[0]['Average Medicare Payments'].should.be.gte(1000);
          done();
        });
    });

    it('GET /providers?min_discharges&max_average_medicare_payments', done => {
      chai.request(server)
        .get(`/providers?min_discharges=6&max_average_medicare_payments=10000`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.equal(121847);
          res.body[0]['Average Medicare Payments'].should.be.lte(10000);
          done();
        });
    });

    it('GET /providers?min_discharges&max_average_covered_charges&min_average_covered_charges&min_average_medicare_payments&max_average_medicare_payments', done => {
      chai.request(server)
        .get(`/providers?min_discharges=6&max_average_covered_charges=5000&min_average_covered_charges=4990&min_average_medicare_payments=1000&max_average_medicare_payments=10000`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.equal(7);
          res.body[0]['Average Covered Charges'].should.be.gte(4990);
          res.body[0]['Average Covered Charges'].should.be.lte(5000);
          res.body[0]['Average Medicare Payments'].should.be.gte(1000);
          res.body[0]['Average Medicare Payments'].should.be.lte(10000);
          done();
        });
    });

    it('GET /providers?min_discharges&max_average_covered_charges&min_average_covered_charges&min_average_medicare_payments&max_average_medicare_payments&state', done => {
      chai.request(server)
        .get(`/providers?min_discharges=6&max_average_covered_charges=5000&min_average_covered_charges=4990&min_average_medicare_payments=1000&max_average_medicare_payments=10000&state=MD`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.equal(2);
          res.body[0]['Average Covered Charges'].should.be.gte(4990);
          res.body[0]['Average Covered Charges'].should.be.lte(5000);
          res.body[0]['Average Medicare Payments'].should.be.gte(1000);
          res.body[0]['Average Medicare Payments'].should.be.lte(10000);
          res.body[0]['Provider State'].should.be.equal('MD');
          done();
        });
    });

    it('GET /providers?min_discharges&min_average_medicare_payments&max_average_medicare_payments', done => {
      chai.request(server)
        .get(`/providers?min_discharges=6&min_average_medicare_payments=1000&max_average_medicare_payments=10000`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.equal(121847);
          res.body[0]['Total Discharges'].should.be.gte(6);
          res.body[0]['Average Medicare Payments'].should.be.lte(10000);
          res.body[0]['Average Medicare Payments'].should.be.gte(1000);
          done();
        });
    });

    it('GET /providers?min_discharges&min_average_medicare_payments&max_average_medicare_payments&state', done => {
      chai.request(server)
        .get(`/providers?min_discharges=6&min_average_medicare_payments=4990&max_average_medicare_payments=10000&state=MD`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.equal(1589);
          res.body[0]['Total Discharges'].should.be.gte(6);
          res.body[0]['Average Medicare Payments'].should.be.lte(10000);
          res.body[0]['Average Medicare Payments'].should.be.gte(4990);
          res.body[0]['Provider State'].should.be.equal('MD');
          done();
        });
    });

    it('GET /providers?max_average_covered_charges', done => {
      chai.request(server)
        .get(`/providers?max_average_covered_charges=37560`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.equal(112907);          
          res.body[0]['Average Covered Charges'].should.be.lte(37560);
          done();
        });
    });

    it('GET /providers?min_average_covered_charges', done => {
      chai.request(server)
        .get(`/providers?min_average_covered_charges=37560`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.equal(50154);          
          res.body[0]['Average Covered Charges'].should.be.gte(37560);
          done();
        });
    });

    it('GET /providers?min_average_medicare_payments', done => {
      chai.request(server)
        .get(`/providers?min_average_medicare_payments=760`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.equal(163061);          
          res.body[0]['Average Medicare Payments'].should.be.gte(760);
          done();
        });
    });

    it('GET /providers?max_average_medicare_payments', done => {
      chai.request(server)
        .get(`/providers?max_average_medicare_payments=70560`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.equal(162983);          
          res.body[0]['Average Medicare Payments'].should.be.lte(70560);
          done();
        });
    });

    it('GET /providers?state', done => {
      chai.request(server)
        .get(`/providers?state=CA`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.equal(13064);
          res.body[0]['Provider State'].should.be.equal('CA')
          done();
        });
    });

    after(() => {
      process.exit();
    });
  });
});