'use strict';

const Report = require('../models/report.model');

function load(req, res, next, id) {
  Report.get(id)
    .then(report => {
      req.report = report;
      return next();
    })
    .catch(err => next(err));
}

function get(req, res) {
  return res.json(req.report);
}


function create(req, res, next) {
  let report = new Report(req.body.report);

  report.attachments = req.files ? req.files
    .map(f => 'uploads/' + f.filename) : [];

  report.save()
    .then(savedReport => res.json(savedReport))
    .catch(err => next(err));
}

function update(req, res, next) {
  let report = req.report;

  Object.keys(req.body.report)
    .forEach(key => report[key] = req.body.report[key]);

  if (req.files) {
    req.files.map(f => 'uploads/' + f.filename).forEach(f => report.attachments.push(f));
  }

  report.save()
    .then(savedReport => res.json(savedReport))
    .catch(err => next(err));
}

function list(req, res, next) {
  let skip = req.query.skip || 0;
  let limit = req.query.limit || 50;

  Report.list(skip, limit)
    .then(reports => res.json(reports))
    .catch(err => next(err));

}


function all(req, res, next) {
  Report.all()
    .then(reports => res.json(reports))
    .catch(err => next(err));
}

function remove(req, res, next) {
  let user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(err => next(err));
}


module.exports = {
  load, get, create, update, list, all, remove
};


