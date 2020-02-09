import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { NarrowDownConnpass } from './narrowDownConnpass';
import { scrapeAsync } from './scrapeAsync';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://attendance-management-v.firebaseio.com'
});


exports.attendance2db = functions.runWith({memory: '1GB', timeoutSeconds: 300}).region('asia-northeast1').https.onCall(async(data, context) => { // eslint-disable-line

  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
        'while authenticated.')
  }

  const eventID = data.eventID;
  if (!eventID) {
    console.log('data.eventID is not found')
    throw new functions.https.HttpsError('invalid-argument', 'data.eventID is undefined.', data)
}

    //const targetUrl = 'https://connpass.com/event/' + eventID + '/participation/';

  // ******に必要なものを入れてください。
  const targetUrl = 'https://tflare.com/testscrapeconnpass/';

  //<div class="user_info">
  //<a class="image_link" href="https://connpass.com/user/tflare/open/">
  //div class="user_info"の直接の子の a class="image_link"を指定
  const targetSelector = 'div.user_info > a.image_link';

  const nd = new NarrowDownConnpass();
  await scrapeAsync(targetUrl, targetSelector, nd, Number(eventID));
  return { message: "success" };
})
