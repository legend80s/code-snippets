/**
 * 预订会议室脚本
 * @param hours 
 * @param min 
 * @param sec 
 * 
 * @example startBook(11, 23)
 */
function startBook(hours, min = 0, sec = 0) {
  const bookingBtns = document.querySelectorAll('.kuma-button.kuma-button-lorange');
  
  if (bookingBtns.length !== 1) { return console.error('页面内找不到会议室预订按钮，页面可能改版了') }

  const bookingBtn = bookingBtn[0];
  
  if (!hours) { return console.error('必须指定会议室开抢时间') }

  function getTargetDate() {
    const d = new Date();

    d.setHours(hours, min, sec, 0);
    
    return d;
  }

  const bookingDate = getTargetDate();
  const bookTimeFromNow = bookingDate - new Date();
  
  if (bookTimeFromNow <= 0) {
    return console.error('不能指定过去时间预订');
  }
    
  if (startBook.timer) {
    console.warn('只能预订一个时间，以最近一次预订为准', bookingDate);

    clearTimeout(startBook.timer);
  }

  console.info('会议室将在', bookingDate, '准时预订')
  console.info('你可通过 startBook.cancel() 取消此次预订')

  startBook.timer = setTimeout(() => {
    console.log('booked at:', new Date())

    bookingBtn.click()

    notifyMe('会议室于 ' + new Date().toString() +  ' 预订成功');
  }, bookTimeFromNow)
  
  startBook.cancel = () => {
    if (!startBook.timer) {
      return console.info('无预订进行中，无需取消');
    }

    clearTimeout(startBook.timer)
    console.log('原定', bookingDate, '的会议室被取消。timerId:', startBook.timer)
    
    startBook.timer = 0;
  };

  return startBook.timer;
}

function notifyMe(msg) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    const notification = new Notification(msg);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification(msg);
      }
    });
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}

// startBook(12)
