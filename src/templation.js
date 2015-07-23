process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
var config        = require('config');
var fs            = require("fs");
var path          = require("path");
var _             = require("lodash");
var smtpTransport = require('nodemailer-smtp-transport');
var emailer       = require("nodemailer");

exports = module.exports = Templation;

function Templation(options){

  var defaultOptions = {
    attachments: [],
    templates: {
      defaultTemplate: path.resolve(__dirname, 'templates/default.html')
    },
    defaultTemplate: path.resolve(__dirname, 'templates/default.html'),
    templateOptions: {
      interpolate: /{{([\s\S]+?)}}/g
    },
    generateTextFromHTML: true
  };

  config.util.extendDeep(defaultOptions, options);
  config.util.setModuleDefaults('Templation', defaultOptions);

}

Templation.prototype.send = function send(data, callback){

  //Get required data to generate HTML
  var template = data.template || config.get('Templation.defaultTemplate');

  var html = this._getHtml(data.messageData, template);
  var attachments = this._getAttachments(html);

  var emailData = {
    to: data.to.name + " <" + data.to.email + ">",
    from: data.from || config.get('Templation.from'),
    subject: data.subject,
    html: html,
    generateTextFromHTML: config.get('Templation.generateTextFromHTML'),
    attachments: attachments
  };

  var transportOptions = data.transportOptions || config.get('Templation.transportOptions');

  return this._getTransport(transportOptions).sendMail(emailData, callback);

};

Templation.prototype._getHtml = function(data, templateName){

  //Resolve our template path using the path of a template given in options,
  //or if the path is the template name itself
  var templatePath = config.get('Templation.templates')[templateName] || templateName;
  var templateContent = fs.readFileSync(templatePath, 'utf8');

  //Return the rendered version of our template via lodash template method.
  return _.template(templateContent, config.get('Templation.templateOptions'))(data);
};

Templation.prototype._getAttachments = function(html){
  var attachments = [];
  this._attachments = config.get('Templation.attachments');

  //Go through each attachment in our options and find out which ones our template is using
  _.forEach(this._attachments, function(attachment){
    if(html.indexOf("cid:" + attachment.cid) > -1)
      attachments.push(attachment);
  });

  return attachments;
};

Templation.prototype._getTransport = function(options){
  return emailer.createTransport(smtpTransport(options));
};
