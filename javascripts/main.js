$(function () {
  var constants = {
    screenXs: 480,
    screenSm: 768,
    screenMd: 992,
    screenLg: 1200
  };

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  setTimeout(function () {
    $('#job').addClass('visible');
  }, 200);

  setTimeout(function () {
    $('#social').addClass('visible');
  }, 700);

  $('#projects').find('.project').each(function (index) {
    var clazz;

    switch (getRandomInt(1, 4)) {
      case 1: clazz = 'top'; break;
      case 2: clazz = 'bottom'; break;
      case 3: clazz = 'right'; break;
      default: clazz = 'left'; break;
    }

    $(this).find('.detail').addClass(clazz);

    setTimeout(function () {
      $(this).addClass('visible');
    }.bind(this), index * 500);
  });
});
