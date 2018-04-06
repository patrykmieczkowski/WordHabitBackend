class PushNotificationBuilder {

  constructor() {
    this._pushNotification = {};
    this._pushNotification.data = {};
  }

  setPrimaryLangWord(primaryLangWord) {
    this.getPushNotification().data.primaryLangWord = primaryLangWord;
  }

  setPrimaryLangDescription(primaryLangDescription) {
    this.getPushNotification().data.primaryLangDescription = primaryLangDescription;
  }

  setSecondaryLangWord(secondaryLangWord) {
    this.getPushNotification().data.secondaryLangWord = secondaryLangWord;
  }

  setSecondaryLangDescription(secondaryLangDescription) {
    this.getPushNotification().data.secondaryLangDescription = secondaryLangDescription;
  }

  setImageUrl(imageUrl) {
    this.getPushNotification().data.imageUrl = imageUrl;
  }

  setTopic(topic) {
    this.getPushNotification().topic = topic;
  }

  getPushNotification() {
    return this._pushNotification;
  }
}

module.exports = PushNotificationBuilder;
