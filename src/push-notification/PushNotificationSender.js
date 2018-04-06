const admin = require('firebase-admin');
const ServiceAccountKeyModel = require('../model/ServiceAccountKeyModel');


class PushNotificationSender {

  constructor() {
    this._isFirebaseAppInitialized = false;
  }

  send(pushNotification) {
    return this._initializeFirebaseApp()
      .then(() => admin.messaging().send(pushNotification));
  }

  _initializeFirebaseApp() {
    if (this._isFirebaseAppInitialized)
      return Promise.resolve();

    return ServiceAccountKeyModel.select()
      .then(serviceAccountKey => {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(serviceAccountKey.getValue())),
          databaseURL: serviceAccountKey.getDatabaseUrl()
        });
        this._isFirebaseAppInitialized = true;
      });
  }
}

module.exports = PushNotificationSender;
