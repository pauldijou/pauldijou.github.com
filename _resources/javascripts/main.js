(function () {
  var constants = {
    screenXs: 480,
    screenSm: 768,
    screenMd: 992,
    screenLg: 1200
  };

  var $ = function (selector, context) {
    return (context || document).querySelector(selector);
  };

  var $$ = function (selector, context) {
    return (context || document).querySelectorAll(selector);
  };

  var removeElement = function (el) {
    el.parentNode.removeChild(el);
  };

  var removeSelector = function (selector, context) {
    removeElement($(selector, context));
  };


  // ----------------------------------------------------------------------
  // INDEX PAGE
  // ----------------------------------------------------------------------
  setTimeout(function () {
    var el = document.getElementById('job');
    el && el.classList.add('visible');
  }, 200);

  setTimeout(function () {
    var el = document.getElementById('social');
    el && el.classList.add('visible');
  }, 700);


  // ----------------------------------------------------------------------
  // PROJECT PAGE
  // ----------------------------------------------------------------------
  var projects = document.getElementById('projects');
  projects && Array.prototype.forEach.call($$('.project', projects), function(el, idx){
    setTimeout(function () {
      el.classList.add('visible');
    }, idx * 500);
  });


  // ----------------------------------------------------------------------
  // CONTACT PAGE
  // ----------------------------------------------------------------------
  var contact = {
    messageSuccess: '<div class="contact-feedback alert alert-info"><h3>Congrats!</h3><p>You successfully send your message. I will answer it as soon as possible.</p></div>',
    messageError: '<div class="contact-feedback alert alert-danger"><h3>Dammit!</h3><p>An error has occured. If it persists, send me a mail instead. Really sorry...</p></div>'
  }

  function onSuccess () {
    contact.form.insertAdjacentHTML('beforebegin', contact.messageSuccess);
    contact.name.value = '';
    contact.email.value = '';
    contact.subject.value = '';
    contact.message.value = '';
  }

  function onError () {
    contact.form.insertAdjacentHTML('beforebegin', contact.messageError);
  }

  function submitContact() {
    contact.form = document.getElementById('formContact');
    contact.name = document.getElementById('contactName');
    contact.email = document.getElementById('contactEmail');
    contact.subject = document.getElementById('contactSubject');
    contact.message = document.getElementById('contactMessage');

    cleanForm();

    var contactTo = 'paul.dijou' + '@' + 'gmail' + '.com';
    var contactName = contact.name.value;
    var contactEmail = contact.email.value;
    var contactSubject = contact.subject.value;
    var contactMessage = contact.message.value;

    var hasErrors = false;
    var errorMsgRequired='Required field';

    var regexMail = /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/;

    if(contactName.length === 0) {
      hasErrors = true;
      addErrorMessage('contactName', errorMsgRequired);
    }

    if(contactEmail.length === 0) {
      hasErrors = true;
      addErrorMessage('contactEmail', errorMsgRequired);
    } else if(!regexMail.test(contactEmail)) {
      hasErrors = true;
      addErrorMessage('contactEmail', 'Email is not valid');
    }

    if(contactSubject.length === 0) {
      hasErrors = true;
      addErrorMessage('contactSubject', errorMsgRequired);
    }

    if(contactMessage.length === 0) {
      hasErrors = true;
      addErrorMessage('contactMessage', errorMsgRequired);
    }

    if(!hasErrors) {
      var request = new XMLHttpRequest();
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

      request.onload = function() {
        if (this.status >= 200 && this.status < 400){
          onSuccess();
        } else {
          onError();
        }
      };

      request.onerror = onError;

      request.open('POST', 'http://data.pauldijou.fr/sendMail.php', true);
      request.send({to: contactTo, from: contactName + '<' + contactEmail + '>', subject: contactSubject, content: contactMessage, submit: 'doIt'});
    }

    return false;
  }

  function cleanForm() {
    removeSelector('.contact-feedback');

    Array.prototype.forEach.call($$('.control-group', contact.form), function(el){
      el.classList.remove('error');
    });

    Array.prototype.forEach.call($$('.control-group .error-message', contact.form), function(el){
      removeElement(el);
    });
  }

  function addErrorMessage(selector, msg) {
    var el = $('.control-group.'+ selector, contact.form);
    el.classList.add('error');
    el.append('<div class="error-message">'+msg+'</div>');
  }

  function sendGmail(opts) {
    var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
      '&to=' + opts.to +
      '&su=' + opts.subject +
      '&body=' + opts.message.replace(/\n/g,'%0A') +
      '&ui=1';
    location.href = str;
  }
})();
