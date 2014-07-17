(function () {
  var constants = {
    screenXs: 480,
    screenSm: 768,
    screenMd: 992,
    screenLg: 1200
  };

  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return (context || document).querySelectorAll(selector);
  }

  function removeElement(el) {
    el && el.parentNode && el.parentNode.removeChild(el);
  }

  function removeSelector(selector, context) {
    removeElement($(selector, context));
  }

  function closest(el, tagName) {
    tagName = tagName.toUpperCase();
    while (el && el.parentNode) {
      if ((el.tagName || el.nodeName) === tagName) {
        el.parentNode = undefined;
      } else {
        el = el.parentNode;
      }
    }
    return el;
  }


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
  // CONTACT PAGE
  // ----------------------------------------------------------------------
  var contact = {
    form: document.getElementById('contactForm'),
    name: document.getElementById('contactName'),
    email: document.getElementById('contactEmail'),
    subject: document.getElementById('contactSubject'),
    message: document.getElementById('contactMessage'),
    messageSuccess: '<div class="contact-feedback alert alert-info"><h3>Congrats!</h3><p>You successfully send your message. I will answer it as soon as possible.</p></div>',
    messageError: '<div class="contact-feedback alert alert-danger"><h3>Dammit!</h3><p>An error has occured. If it persists, send me a mail instead. Really sorry...</p></div>'
  }

  if (contact.form) {
    contact.form.addEventListener('submit', function (ev) {
      ev.preventDefault && ev.preventDefault();
      return submitContact();
    });

    contact.form.addEventListener('reset', function (ev) {
      cleanForm();
    });
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
    if (!contact.form) return;

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
      request.open('POST', 'http://data.pauldijou.fr/sendMail.php', true);
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

      request.onload = function() {
        if (this.status >= 200 && this.status < 400){
          onSuccess();
        } else {
          onError();
        }
      };

      request.onerror = onError;

      request.send('submit=doIt&to='+contactTo+'&from='+contactName+'<'+contactEmail+'>'+'&subject='+contactSubject+'&content='+contactMessage);
    }

    return false;
  }

  function cleanForm() {
    if (!contact.form) return;

    removeSelector('.contact-feedback');

    Array.prototype.forEach.call($$('.control-group', contact.form), function(el) {
      el.classList.remove('error');
    });

    Array.prototype.forEach.call($$('.control-group .error-message', contact.form), function(el, i) {
      removeElement(el);
    });
  }

  function addErrorMessage(selector, msg) {
    var el = $('.control-group.'+ selector, contact.form);
    el.classList.add('error');
    el.insertAdjacentHTML('beforeend', '<div class="error-message">' + msg + '</div>');
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
