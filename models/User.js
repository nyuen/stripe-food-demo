const db = require('../db');

class User {
  static get table() {
    return 'users';
  }

  constructor(opts) {
    this.id = opts.id;
    this.email = opts.email;
  }

  // Get an User by id from the database
  static async getByEmail(email) {
    try {
      const [user] = await db(this.table).where('email', email);
      if (!user) {
        return null;
      }
      return new User(user);
    } catch (e) {
      throw new Error(e);
    }
  }

}
