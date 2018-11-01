angular.module('cplantApp').factory('avatarService', [function () {
  'use strict';

  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
  }

  function generateAvatar(name, elementId) {
    var colours = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'];

    // var nameSplit = name.split(' ');
    // var initials = nameSplit[0].charAt(0).toUpperCase();
    // if(nameSplit.length > 1) {  
    //   initials += nameSplit[1].charAt(0).toUpperCase();
    // } else {
    //   if(nameSplit[0].length > 1) {
    //     initials += nameSplit[0].charAt(1).toUpperCase();
    //   }
    // }

    //  initials += 'qwert124325'
    var initials = name;

    var charIndex = initials.charCodeAt(0) - 65,
      colourIndex = charIndex % 19;

    var canvas = document.getElementById(elementId);
    var context = canvas.getContext('2d');

    var canvasWidth = $(canvas).width(),
      canvasHeight = $(canvas).height(),
      canvasCssWidth = canvasWidth,
      canvasCssHeight = canvasHeight;

    if (window.devicePixelRatio) {
      $(canvas).attr('width', canvasWidth * window.devicePixelRatio);
      $(canvas).attr('height', canvasHeight * window.devicePixelRatio);
      $(canvas).css('width', canvasCssWidth);
      $(canvas).css('height', canvasCssHeight);
      context.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    context.fillStyle = colours[colourIndex];
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '20px Arial';
    context.textAlign = 'center';
    context.fillStyle = '#FFF';
    context.fillText(initials, canvasCssWidth / 2, canvasCssHeight / 1.5);
  }

  return {
    generateAvatar
  };
}]);
