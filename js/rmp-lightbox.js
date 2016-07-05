/**
 * @license Copyright (c) 2015-2016 Radiant Media Player | https://www.radiantmediaplayer.com
 * rmp-lightbox | https://github.com/radiantmediaplayer/rmp-lightbox
 * Released under the MIT license
 * Contact information: https://www.radiantmediaplayer.com/contact.html
 */
(function () {
  'use strict';

  // closing lightbox callback
  var _closeLightbox = function () {
    if (this.debug) {
      console.log('RMP-lightbox: close lightbox function');
    }
    this.lightboxOnStage = false;
    this.lightboxBackground.style.display = 'none';
    // we pause player when lightbox is hidden
    this.pause();
  };

  // click handler when close button is interacted with
  var _clickClose = function (event) {
    if (this.debug) {
      console.log('RMP-lightbox: click to close lightbox handler');
    }
    event.stopPropagation();
    // this is for "fastclick" on mobile devices
    if (event.type === 'touchstart') {
      event.preventDefault();
    }
    if (this.lightboxOnStage) {
      _closeLightbox.call(this);
    }
  };

  // click handler when lightbox is on stage and click happens outside player wrapper 
  // in this case we need to close the lightbox
  var _clickWindow = function (event) {
    if (this.debug) {
      console.log('RMP-lightbox: click on window');
      console.log(event);
    }
    if (event.type === 'touchstart') {
      event.preventDefault();
    }
    if (this.lightboxOnStage) {
      if (event && event.target &&
        (this.fw.hasClass(event.target, 'rmp-lightbox-wrapper') ||
          this.fw.hasClass(event.target, 'rmp-video') ||
          this.fw.hasClass(event.target, 'rmp-poster-img') ||
          this.fw.hasClass(event.target, 'rmp-container'))) {
        return;
      } else {
        _closeLightbox.call(this);
      }
    }
  };

  // append lightbox to DOM when first requested
  var _appendBackground = function (element, settings) {
    if (this.debug) {
      console.log('RMP-lightbox: append lightbox to DOM on first request');
    }
    this.lightboxBackground = document.createElement('div');
    this.lightboxBackground.className = 'rmp-lightbox-background';
    this.lightboxBackground.id = 'rmp-lightbox' + element;
    this.lightboxBackground.style.display = 'block';

    var wrapper = document.createElement('div');
    wrapper.className = 'rmp-lightbox-wrapper';

    var content = document.createElement('div');
    content.id = element;

    var closeButton = document.createElement('div');
    closeButton.className = 'rmp-lightbox-close rmp-i rmp-i-close';
    closeButton.addEventListener('click', _clickClose.bind(this));
    closeButton.addEventListener('touchstart', _clickClose.bind(this));

    wrapper.appendChild(closeButton);
    wrapper.appendChild(content);
    this.lightboxBackground.appendChild(wrapper);

    var body = document.body || document.getElementsByTagName("body")[0];
    body.appendChild(this.lightboxBackground);

    window.addEventListener('click', _clickWindow.bind(this));
    window.addEventListener('touchstart', _clickWindow.bind(this));

    // we init the player once all elements are appended to DOM
    this.init(settings);
  };

  // when the linked HTML element is clicked we open lightbox
  var _clickButton = function (settings, event) {
    if (settings.debug) {
      console.log('RMP-lightbox: click to open lightbox handler');
    }
    event.stopPropagation();
    if (event.type === 'touchstart') {
      event.preventDefault();
    }
    // if lightbox is not into the DOM we append it otherwise we just show it
    if (!this.lightboxAppended) {
      this.lightboxOnStage = true;
      _appendBackground.call(this, this.id, settings);
      this.lightboxAppended = true;
    } else {
      if (!this.lightboxOnStage) {
        this.lightboxOnStage = true;
        this.lightboxBackground.style.display = 'block';
      }
    }
  };

  // init lightbox
  RadiantMP.prototype.initLightbox = function initLightbox(settings, lightboxId) {
    if (settings.debug) {
      console.log('RMP-lightbox: initLightbox called');
    }
    this.lightboxOnStage = false;
    this.lightboxAppended = false;
    var button = document.getElementById(lightboxId);
    button.addEventListener('click', _clickButton.bind(this, settings));
    button.addEventListener('touchstart', _clickButton.bind(this, settings));
  };

} ());