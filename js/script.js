// Global Variable declarations
  var grid = {}; //central object
  var color = '##418cd2'; //global theme color

// Game initialization
  initialize(false);

// event listeners
  // clicks on grid
  $('body').on('click','.cols', clickListener);
  // modal triggers
  $('body').on('click','.container', displayEnd);
  // reset grid
  $('body').on('click','.reset', initialize);
