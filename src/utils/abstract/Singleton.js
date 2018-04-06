class Singleton {

  constructor() {
    const myClass = this.constructor;

    if (!myClass._instance)
      return (myClass._instance = this);

    throw new Error(
      `Unable to create instance of singleton class \`\`${myClass.name}\`\``);
  }

  static instance() {
    return this._instance || new this();
  }
}

module.exports = Singleton;
