// function declarations

// Function category 1: Events and (re)initializations
  function clickListener() {
    timer(true,grid);
    rotateCell($(this),false);
    applyImage($(this),getTag($(this)),false);
    if (!triggerWatch($(this),grid)) {
      setTimeout(rollBackCell, 200);
    };
    updateCounter($('.score'), grid);
    updateRating($('.stars'), grid);
    // is it the end?
    if (endWatcher($(this),grid,true)) {
      displayEnd();
    }
  }

  function rollBackCell() {
    rotateCell(grid.counter[grid.counter.length-1],false);
    applyImage(grid.counter[grid.counter.length-1],"");
    rotateCell(grid.counter[grid.counter.length-2],false);
    applyImage(grid.counter[grid.counter.length-2],"");
  }

  function initialize(reset) {
    if (reset) {
      //re-set old initializations
      deleteGrid();
      close();
    }
    //begin initialize
    grid = makeGrid($('main'),4);
    grid = applyProperties(grid,true);
    rotateCell(grid,true);
    // start timer
    grid.clock = setInterval(function() {
      $('.timer')[0].textContent = timer(true ,grid, false);
    },1000);
    //retrieve existing achievements
    setAchievement(0);
  }

// Function category 2: building objects and properties
  function makeGrid(container, input, variant) {
    var array = {
      rows: [],
      cols: []
    };
    // make rows
    for (var i = 0; i < input; i++) {
      container.prepend("<div class= 'rows'>")
    }
    // make columns
    $('.rows').each(function(index){
      array.rows[index] = $(this);
      array.cols[index] = [];
      if (variant===undefined) {
        for (var i = 0; i < input; i++) {
          $(this).prepend("<div class= 'cols'>")
          array.cols[index][i]=$(this).children().first();
        }
      }
      else {
        for (var i = 0; i < variant; i++) {
          $(this).prepend("<div class= 'cols'>")
          array.cols[index][i]=$(this).children().first();
        }
      }
    });
    // result to console
    variant===undefined ? console.log(input+'x'+input+' Grid created!\
    '):console.log(input+'x'+variant+' Grid created!');
    return array;
  };

  function applyProperties(obj, randomImage) {
    // assign properties
    obj.source = [
      'img/favicon.png',
      'img/alienware.png',
      'img/docs.png',
      'img/sheets.png',
      'img/icon.png',
      'img/app.png',
      'img/drive.png',
      'img/gnote.png',
      'img/logo.png',
      'img/slides.png'
    ];
    obj.badges = [
      'img/badge1.png',
      'img/badge2.png',
      'img/badge3.png',
      'img/sheets.png',
      'img/icon.png'
    ],
    obj.cell = [];
    obj.image = [];
    obj.tag = [];
    obj.counter = [];
    obj.toggle = false;
    obj.end = [];
    obj.achievements = [];
    obj.timer = false;
    obj.clock;
    obj.start;

    // select unique images from source
    for (var i = 0; i < obj.source.length; i++) {
      if (obj.image.includes(obj.source[i])===false) {
        obj.image.push(obj.source[i]);
      }
    }
    // retrieve array of cells in grid
    obj = findCells(obj);
    // assign random image to cells of grid
    if (randomImage===true) {
      applyImage(obj,"", true);
    }
    console.log('No peeking!!!!', obj.tag);
    return obj;
  }

// Function category 3: perform actions
  function timer(start, array, stop) {
    if (start) {
      if (!array.timer) {
        array.timer = true;
        array.start = new Date().getTime();
        return Math.ceil((new Date().getTime() - array.start)/1000)
      }
      else {
        // returns time since start
        return Math.ceil((new Date().getTime() - array.start)/1000);
      }
    }
    if (stop) {
      array.timer = false;
      // stop timer
      clearInterval(array.clock);
      return Math.floor((new Date().getTime() - array.start)/1000);
    }
  }

  function rotateCell(obj, isGrid, dummyImage) {
    if (isGrid) {
      for (var i = 0; i < obj.cell.length; i++) {
        obj.cell[i].toggleClass('rotate');
        if (dummyImage) {
          applyImage (obj.cell[i],dummyImage);
        }
        else {
          applyImage (obj.cell[i],"");
        }
      }
    }
    else {
      obj.toggleClass('rotate');
    }
  }

  function applyImage(obj, image, isGrid, isBadge) {
    if (isGrid) {
      var randomArray = buildRandomSequence(0,obj.cell.length/2,2,obj.image.length);
      //var randomArray = shuffleArray(buildRandomSequence(0,obj.cell.length/2,2,obj.image.length));
      for (var i = 0; i < obj.cell.length; i++) {
        obj.tag[i] = obj.image[randomArray[i]];
        obj.cell[i].css('background-image',"url("+obj.tag[i]+")")
      }
    }
    else if (isBadge) {
      obj.css('background-image', "url("+image+")")
    }
    else {
      if (obj[0].classList.length>1) {
        obj.css('background-image',"url("+''+")")
      }
      else {
        obj.css('background-image', "url("+image+")")
      }
    }
  }

  function findCells(obj) {
    // create array of cells in grid
    for (var i = 0; i < obj.cols.length; i++) {
      for (var j = 0; j < obj.cols[i].length; j++) {
        // select cell
        if (obj.cell.includes(obj.cols[i][j])===false) {
          obj.cell.push(obj.cols[i][j]);
        }
      }
    }
    return obj;
  }

  function match(obj, array) {
    return getTag(array.counter[array.counter.length-2])===getTag(obj)
  }

// Function category 4: helpers
  function buildRandomSequence(min, max, factor, range) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var randomArray = [];
    var value;
    if (range<max) {
      range=max;
    }
    for (var i = 0; i < (max-min); i++) {
      value = Math.floor(Math.random() * range) + min;
      if (randomArray.indexOf(value)===-1) {
        randomArray.push(value);
      }
      else {
        i--;
      }
    }
    if (factor>1) {
      randomArray = randomArray.concat(randomArray);
    }
    return randomArray;
  }

  function shuffleArray(array) {
    var shuffle = shuffleArray(buildRandomSequence(0,array.length,1,array.length));
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
      newArray.push(array[shuffle[i]]);
    }
    return newArray;
  }

  function getTag(obj) {
    for (var i = 0; i < grid.cell.length; i++) {
      if (obj[0]===grid.cell[i][0]) {
        break;
      }
    }
    return grid.tag[grid.cell.indexOf(grid.cell[i])];
  }

  function nextBadge() {
    for (var i = 0; i < $('.badge').length; i++) {
      if (!$('.badge')[i].style.backgroundImage) {
        return $($('.badge')[i]);
      }
    }
  }

// Function category 5: update data
  function updateCounter(counter, array) {
    counter[0].textContent = array.counter.length;
  }

  function updateRating(rating, array) {
    if (array.counter.length<=array.cell.length) {
      for (var i = 0; i < 5; i++) {
        rating[i].textContent = '★';
      }
    }
    if (array.counter.length>array.cell.length&&array.counter.length<array.cell.length*1.5) {
      rating[rating.length-1].textContent = '☆';
    }
    if (array.counter.length>array.cell.length*1.5&&array.counter.length<array.cell.length*2) {
      rating[rating.length-2].textContent = '☆';
    }
    if (array.counter.length>array.cell.length*2&&array.counter.length<array.cell.length*2.5) {
        rating[rating.length-3].textContent = '☆';
      }
    if (array.counter.length>array.cell.length*2.5&&array.counter.length<array.cell.length*2.8) {
      for (var i = 0; i < rating.length-3; i++) {
        rating[rating.length-4].textContent = '☆';
      }
    }
  }

  function setAchievement(input) {
    if (input===1) {
      applyImage(nextBadge(),grid.badges[0],false,true)
      grid.achievements.push(grid.badges[0]);
    }
    if (input===2) {
      applyImage(nextBadge(),grid.badges[1],false,true)
      grid.achievements.push(grid.badges[1]);
    }
    if (input===3) {
      applyImage(nextBadge(),grid.badges[2],false,true)
      grid.achievements.push(grid.badges[2]);
    }
    if (input===0) {
      //retrieve existing achievements from previous sessions
      for (var i = 0; i < Object.keys(localStorage).length; i++) {
        if (localStorage.key(i)!=='best'&&localStorage.key(i)!=='session') {
          grid.achievements.push(localStorage.getItem(localStorage.key(i)));
          applyImage($($('.badge')[i]),localStorage.getItem(localStorage.key(i)),false,true)
        }
      }
      if (localStorage.getItem('session')<1) {
        $('.welcome')[0].textContent = 'Welcome!! to The Memory game.\
        Click on the tiles below to find matching ones. The game is \
        over when you have uncovered all the matching tiles. Happy clicking. :)'
      }
      else {
        $('.welcome')[0].textContent = 'Welcome back!! The game \
        has been reset and you can start solving the puzzle again.'
        if (grid.achievements.length>0) {
          $('.welcome')[0].textContent += 'You will find all your\
          achievements are still in place.'
        }
        $('.welcome')[0].textContent += ' Happy clicking. :)';
      }
    }
  }

  // Function category 6: monitoring and analysis
  function triggerWatch(obj, array) {
    //increment click counter
    array.counter.push(obj);
    if (array.toggle) {
      array.toggle = false;
      if (!match(obj, array)) {
        // unfreeze cell
        array.counter[array.counter.length-2].unbind('click');
        return false;
      }
      else {
        //match found
        // freeze cell
        obj.bind('click', function(){return false; });
        endWatcher (obj, array, false);
        return true;
      }
    }
    else {
      array.toggle = true;
      // freeze cell
      obj.bind('click', function(){return false; });
      return true;
    }
  }

  function endWatcher(obj, array, check) {
    if (check) {
      // return the frozen cells
      return array.end.length===array.cell.length? true:false;
    }
    else {
      // update the frozen cell count
      array.end.push(obj);
      array.end.push(array.counter[array.counter.length-2]);
    }
  }

// Function category 7: storage, retrieval and modal operations
  function storePerf() {
    // session counter
    if (localStorage.getItem('session')===null) {
      localStorage.setItem('session',1);
    }
    else {
      var set = localStorage.getItem('session')*1+1;
      localStorage.setItem('session',set);
    }
    // best score
    if (localStorage.getItem('best')!==null) {
      if (grid.counter.length<=localStorage.getItem('best')) {
        localStorage.setItem('best',grid.counter.length);
      }
    }
    else {
      localStorage.setItem('best',grid.counter.length);
    }
    grid.counter = [];
    // best achievements
    for (var i = 0; i < grid.achievements.length; i++) {
      var set = 'badge'+(grid.achievements.length);
      localStorage.setItem(set, grid.achievements[i]);
    }
  }

  function displayEnd() {
    var stars = '';
    if (localStorage.getItem('best')===null) {
      $('.current')[0].textContent+= 'This is your first score : '+grid.counter.length;
      for (var i = 0; i < $('.stars').length; i++) {
        if ($('.stars')[i].textContent==="★") {
          stars += $('.stars')[i].textContent;
        }
      }
      $('.ratings')[0].textContent+= 'Your star rating for this round is : '+stars;
      $('.achieve')[0].textContent+= 'Achievement unlocked!! 1st High Score'
      setAchievement(1);
    }
    else if (grid.counter.length<localStorage.getItem('best')) {
      $('.current')[0].textContent+= 'You beat your old high score. \
      Congratulations!! New high score achieved!! : '+grid.counter.length;
      for (var i = 0; i < $('.stars').length; i++) {
        if ($('.stars')[i].textContent==="★") {
          stars += $('.stars')[i].textContent;
        }
      }
      $('.ratings')[0].textContent+= 'Your star rating for this round is : '+stars;
      $('.best')[0].textContent+= 'Previous high score was: '+localStorage.getItem('best');
      if ($('.badge')[1].style.backgroundImage==='') {
        $('.achieve')[0].textContent+= 'Achievement unlocked!! Beat old score';
        setAchievement(2);
      }
    }
    else if (grid.counter.length===localStorage.getItem('best')*1) {
      $('.current')[0].textContent+= 'You matched your old high score of : \
      '+grid.counter.length;
      for (var i = 0; i < $('.stars').length; i++) {
        if ($('.stars')[i].textContent==="★") {
          stars += $('.stars')[i].textContent;
        }
      }
      $('.ratings')[0].textContent+= 'Your star rating for this round is : '+stars;
    }
    else if (grid.counter.length>localStorage.getItem('best')) {
      $('.current')[0].textContent+= 'Your current score is: '+grid.counter.length;
      for (var i = 0; i < $('.stars').length; i++) {
        if ($('.stars')[i].textContent==="★") {
          stars += $('.stars')[i].textContent;
        }
      }
      $('.ratings')[0].textContent+= 'Your star rating for this round is : '+stars;
      $('.best')[0].textContent+= 'Your best score was: '+localStorage.getItem('best');
    }
    if (localStorage.getItem('session')*1===4) {
      $('.achieve')[0].textContent+= 'Achievement unlocked!! Solved 5 times'
      setAchievement(3);
    }
    $('.time')[0].textContent = 'Duration of play is: ' + timer(false,grid,true) + ' seconds';
    $('.modal')[0].style.display = "block";
  }

// Function category 8: cleanup and reset
  function close() {
    $('.modal')[0].style.display = "none";
  }

  function deleteGrid() {
    $('.rows').remove();
    storePerf();
    clearTextContent();
    updateCounter($('.score'), grid);
  };

  function clearTextContent() {
    $('.current')[0].textContent = '';
    $('.best')[0].textContent = '';
    $('.ratings')[0].textContent = '';
    $('.time')[0].textContent = '';
    $('.achieve')[0].textContent = '';
    $('.score')[0].textContent = '0';
    $('.timer')[0].textContent = '0';
    for (var i = 0; i < $('.stars').length; i++) {
      $('.stars')[i].textContent = '☆';
    }
    console.clear('');
    $('.welcome')[0].textContent = '';
  }
