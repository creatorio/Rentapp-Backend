const { parentPort } = require("worker_threads");
//setTimeout(() => {
//   webPush
//     .sendNotification(subscription, payload)
//     .catch((err) => console.error(err));
//}, 5000);
let info = [];
parentPort.on("message", (e) => {
  if (e.paid) {
    let bub = info.find(({ id }) => id == e.sub);
    let ai = info.indexOf(bub);
    info.splice(ai, 1);
    console.log(info);
  } else if (!e.paid && !e.deleted) {
    info.push(e);
    console.log(info);
  } else if (e.deleted) {
    let bub = info.find(({ id }) => id == e.sub);
    let ai = info.indexOf(bub);
    info.splice(ai, 1);
    console.log(info);
  }
});
setInterval(() => {
  for (let i = 0; i < info.length; i++) {
    const element = info[i];
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    if (day == element.day && !element.paid && month + 1 == element.month) {
      parentPort.postMessage({
        condition: true,
        sub: element.sub,
        payload: element.payload,
      });
      console.log(month);
      info[i].day = info[i].day + 1;
    }
  }
}, 1000);
