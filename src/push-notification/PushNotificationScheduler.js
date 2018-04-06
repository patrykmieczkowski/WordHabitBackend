const PushNotificationBuilder = require('./PushNotificationBuilder');
const AppContext = require('../utils/AppContext');
const WordModel = require('../model/WordModel');
const TopicModel = require('../model/TopicModel');


class PushNotificationScheduler {

  constructor() {
    this._timeoutId = null;
  }

  setPushNotificationSender(pushNotificationSender) {
    this._pushNotificationSender = pushNotificationSender;
  }

  getPushNotificationSender() {
    return this._pushNotificationSender;
  }

  setInterval(interval) {
    this._interval = interval;
  }

  getInterval() {
    return this._interval;
  }

  start() {
    this._timeoutId = setTimeout(() => this._execute(), this._interval);
  }

  stop() {
    clearTimeout(this._timeoutId);
    this._timeoutId = null;
  }

  _execute() {
    WordModel.selectAllForExecution()
      .then(wordsForExecution => this._processMultipleWords(wordsForExecution))
      .then(() => this.start())
      .catch((err) => this._handleFailure(err));
  }

  _processMultipleWords(words) {
    if (!words)
      return Promise.resolve();

    return Promise.all(words.map(word =>
      this._getTopic(word)
        .then(topic => {
          let pushNotification = this._buildPushNotification(word, topic);
          AppContext.instance().getLogger().info(
            `\`PushNotificationScheduler\` sending push notification: ` +
            `"${JSON.stringify(pushNotification)}" ` +
            `for word with ID: "${word.getId().toString()}"`);
          return this._sendPushNotification(pushNotification);
        })
        .then(() => {
          AppContext.instance().getLogger().info(
            `\`PushNotificationScheduler\` push notification for word with ID: ` +
            `"${word.getId().toString()}" successfully sent`);
          return word.markAsExecuted();
        })
    ));
  }

  _getTopic(word) {
    return TopicModel.selectOne(
      word.getPrimaryLang(),
      word.getSecondaryLang(),
      word.getEnvironment()
    );
  }

  _buildPushNotification(word, topic) {
    const pushNotificationBuilder = new PushNotificationBuilder();
    pushNotificationBuilder.setPrimaryLangWord(word.getPrimaryLangWord());
    pushNotificationBuilder.setPrimaryLangDescription(word.getPrimaryLangDescription());
    pushNotificationBuilder.setSecondaryLangWord(word.getSecondaryLangWord());
    pushNotificationBuilder.setSecondaryLangDescription(word.getSecondaryLangDescription());
    pushNotificationBuilder.setImageUrl(word.getFullImageUrl());
    pushNotificationBuilder.setTopic(topic.getName());
    return pushNotificationBuilder.getPushNotification();
  }

  _sendPushNotification(pushNotification, topic) {
    return this.getPushNotificationSender().send(pushNotification, topic);
  }

  _handleFailure(err) {
    const message = err && err.message;
    AppContext.instance().getLogger().error(
      `\`PushNotificationScheduler\` failure: "${message}"`);
    this.stop();
    this.start();
  }
}

module.exports = PushNotificationScheduler;
