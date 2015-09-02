# nodemailer-templation
_A Nodemailer wrapper for easily sending HTML templated emails._

I've always had problems trying to send emails via multiple HTML templates. There really wasn't anything that solved
all of my needs in a way that was easy and made sense to me. I found a code snippit some where for node 0.8x,
that didn't work, so I adapted it into this package.

### Installation

Install via __Download__,

__NPM (recommended)__
```bash
npm install --save nodemailer-templation
```

### Useage

You need an __external SMTP server__ or service to make this work. I recommend Mandrill. Its free, and fast.

Example using [mandrill](mandrillapp.com) as our SMTP service.
```js
var Templation  = require('nodemailer-templation');
var path        = require('path');

//Create our new new mailer object
var Mailer = new Templation({
    from: 'hello@example.com',
    templates: {
      reply: path.resolve(__dirname, '../templates/reply.html')
    },
    attachments: [
      {
        filename: 'logoLite.png',
        path: path.resolve(__dirname, '../templates/images/logoLite.png'),
        cid: 'light@logo'
      },
      {
        filename: 'logoDark.png',
        path: path.resolve(__dirname, '../templates/images/logoDark.png'),
        cid: 'dark@logo'
      }
    ],
    transportOptions: {
      host: 'smtp.mandrillapp.com',
      port: 587,
      auth: {
        user: 'SomeUserName',
        pass: 'SomeUserNameAPIKEY'
      }
    }
  });

//Send a mail using a template you've created, and listed under the templates option above.
Mailer.send({
  to: 'acoolguy@google.com',
  subject: 'Hello World',
  template: 'reply',
  messageData: {
    title: 'Hello Dude',
    name: 'Woah',
    message: 'Far Out'
  }
});

//Send a mail using the default template
Mailer.send({
  to: 'a2coolguy@google.com',
  subject: 'Hello World',
  messageData: {
    title: 'Hello Dude',
    name: 'Woah',
    message: 'Far Out',
    copymark: '(c) TooCool LLC 1995'
  }
});
```

### Templation Options

There are the options you can send in when you create your new Templation object.<br/>

__attachments__ _(array) of objects_
```js
var attachments = [
  {
    filename: 'logoLite.png',
    path: path.resolve(__dirname, '../templates/images/logoLite.png'),
    cid: 'light@logo' //used in your template when you send emails.
  }
];

/* Example including above logo attachment
<img src="cid:light@logo" alt="My Company LLC.">
*/
```
<br/>
__templates__ _list of objects_
```js
var templates = {
  //name: "path"
  reply: path.resolve(__dirname, '../templates/reply.html'),
  answer: path.resolve(__dirname, '../templates/answer.html'),
  news-letter: path.resolve(__dirname, '../templates/news-letter.html')
};
```
<br/>
__defaultTemplate__ _string_ <br/>
The default template used when you don't send in a template string for the mailer options.
```js
var defaultTemplate = path.resolve(__dirname, '../templates/default.html');
```
<br/>
__templateOptions__ _object_ <br/>
[Lodash template options](https://lodash.com/docs#template).
```js
var templateOptions = {
  interpolate: /{{([\s\S]+?)}}/g //use {{thing}} as a basis for dynamic message data
};
```
<br/>
__generateTextFromHTML__ _boolean_ <br/>
To generate text from HTML or neigh.
<br/><br/>

__transportOptions__ _object (required)_ <br/>
[nodemailer-smtp-transport options](https://github.com/andris9/nodemailer-smtp-transport#usage).
You can either set this to be used for all templates, or send in a transportOptions field when you
use the send() method below.
```js
var transportOptions = {
  host: 'smtp.mandrillapp.com',
  port: 587,
  auth: {
    user: 'SomeUserName',
    pass: 'SomeUserNameAPIKEY'
  }
};
```
<br/>
__from__ _string (required)_ <br/>
The email address of where you are sending this from. You can either set this to be used for all templates,
or send in a from field when you use the send() method below.
```js
var from = "some@email.com";
```

### Templation.send() Method Options

These are the options when you send using your Template object
```js
var Mailer = new Templation(templationOptions);
Mailer.send(mailerOptions);
```
<br/>

__to__ _object or string (required)_
```js
var to = { //equivalent to "Bruce Wayne <iamnotbatman@wayne.com>"
  name: 'Bruce Wayne',
  email: 'iamnotbatman@wayne.com'
};

//OR

var to = "iamnotbatman@wayne.com";
```
<br/>

__from__ _string (see above)_ <br/>
<br/>

__subject__ _string (required)_
```js
var subject = 'TPS Reports';
```
<br/>

__template__ _string_ <br/>
The name of the template if you defined one above, or a (string) path to a template.html file
```js
var template = 'report';

//OR

var template = path.resolve(__dirname, '/someTemplate.html');
```
<br/>

__messageData__ _object_ <br/>
Corresponding fields to what is inside of the template.html file
```js
var messageData = {
  title: 'Hello Dude',
  name: 'Woah',
  message: 'Far Out',
  copymark: '(c) TooCool LLC 1995'
};
```
<br/>

__transportOptions__ _object (see above)_<br/>
<br/>
