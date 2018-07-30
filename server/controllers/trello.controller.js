'use strict';

const fs = require('fs');
const path = require('path');
const request = require('request');
const FormData = require('form-data');

const config = require('../config/environment');

function generateProposalQuestionsDesc(proposal) {
  let desc = `
  - App Name: ${proposal.name}
  - The product will help with: ${proposal.requiredQuestions.product}
  - The SBR belong to: ${proposal.requiredQuestions.sbr}
  - Target user: ${proposal.requiredQuestions.targetUser}
  - Key requirements or features: ${proposal.requiredQuestions.keyDesc}
  - Scenarios: ${proposal.requiredQuestions.scenarios}
  - Special reason: ${proposal.requiredQuestions.specialReason}
  - Contacts: ${proposal.contacts}
  `;

  if (proposal.optionalQuestions.expectUsers) {
    desc += `- Potential users would this tool have: ${proposal.optionalQuestions.expectUsers}\n`;
  }

  if (proposal.optionalQuestions.caseFrequency) {
    desc += `- The number of cases that were opened in the last 30 days related to the problem that the tool targets: ${proposal.optionalQuestions.caseFrequency}\n`;
  }

  if (proposal.optionalQuestions.expectCaseDecreasing) {
    desc += `- Expect case decreasing: ${proposal.optionalQuestions.expectCaseDecreasing}\n`;
  }

  if (proposal.optionalQuestions.expectTTCDecreasing) {
    desc += `- Percentage of TTC can be saved: ${proposal.optionalQuestions.expectTTCDecreasing}\n`;
  }

  if (proposal.optionalQuestions.similarTools) {
    desc += `- Similar tools: ${proposal.optionalQuestions.similarTools}\n`;
  }

  if (proposal.optionalQuestions.relatedKBaseRes) {
    desc += `- KBase solutions or documents related to this tool: ${proposal.optionalQuestions.relatedKBaseRes}\n`;
  }

  return desc;
}

function uploadReportAttachmentsCb(err, res, body) {
  if (err) {
    return console.log(err);
  }

  console.log(body);
}


function createProposalTrello(req, res, next) {
  let proposal = req.proposal;

  let options = {
    method: 'POST',
    url: 'https://api.trello.com/1/cards',
    qs:
      {
        name: `[New App] - ${proposal.name}: ${proposal.summary}`,
        desc: `${proposal.desc}\n` + generateProposalQuestionsDesc(proposal),
        idList: '5b481575bef3aa16617e88b2',
        idLabels: '5b481575bef3aa16617e88e3',
        keepFromSource: 'all',
        key: 'bec13052d256572950ba634c154f67ce',
        token: '53886017812236768a88b967a931b2ad22637c16ec0e8b525344282eee801500'
      }
  };

  request(options, function (error, response, body) {
    if (error) {
      throw new Error(error);
    }

    proposal.trelloCardId = body.id;
    proposal.status = 'ACCEPTED';

    proposal.save();

    return res.send({result: true});
  });
}

function createReportTrello(req, res, next) {
  let report = req.report;

  let options = {
    method: 'POST',
    url: 'https://api.trello.com/1/cards',
    qs:
      {
        name: `[${report.type === 'BUG' ? 'Bug' : 'Enhancement'}] - ${report.app.name}: ${report.summary}`,
        desc: `${report.desc}`,
        idList: '5b481575bef3aa16617e88b2',
        idLabels: report.type === 'BUG' ? '5b481575bef3aa16617e88e6' : '5b481575bef3aa16617e88e8',
        keepFromSource: 'all',
        key: 'bec13052d256572950ba634c154f67ce',
        token: '53886017812236768a88b967a931b2ad22637c16ec0e8b525344282eee801500'
      }
  };

  request(options, function (error, response, body) {
    if (error) {
      throw new Error(error);
    }

    report.trelloCardId = JSON.parse(body).id;
    report.status = 'ACCEPTED';

    report.save();
    for (let attachment of report.attachments) {
      let filePath = path.resolve(config.publicDir + `/${attachment}`);


      let options = {
        method: 'POST',
        url: `https://api.trello.com/1/cards/${report.trelloCardId}/attachments`,
        qs:
          { key: 'bec13052d256572950ba634c154f67ce',
            token: '53886017812236768a88b967a931b2ad22637c16ec0e8b525344282eee801500' }
      };

      let r = request(options, uploadReportAttachmentsCb);
      let form = r.form();

      form.append('file', fs.createReadStream(filePath));

    }

    return res.send({result: true});
  });
}


module.exports = {
  createProposalTrello,
  createReportTrello
};
