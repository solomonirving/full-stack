const fs = require("fs");
const crypto = require('crypto')
const util = require('util')
const Repository = require('./repository')

const scrypt = util.promisify(crypto.scrypt)

//Creating custom repository
class UsersRepository extends Repository{
  //Creating User Record
       //Compare passwords
       async comparePaswords(saved, supplied) {
        //Saved = password saved in DB (hashed.salt)
        //Supplied = password given to us by a user trying to sign in
        //split saved at the "."
        const [hashed, salt] = saved.split('.')
        //take second element (after "." and assign it to salt)
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64)
        return hashed === hashedSuppliedBuf.toString('hex');
      }
      //generate randomID for each record
      //attrs === {email:'', password:''}
      async create(attrs) {
        attrs.id = this.randomID()
        //salting
        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64)

    //get list of users
    const records = await this.getAll();
    //push in new user
    const record = {
      ...attrs,
      //period between hex and salt represents where the password ends and where salt begins
      password: `${buf.toString('hex')}.${salt}`
    };
    records.push(record);
    //call helper function writeAll
    await this.writeAll(records);
    //return attrs when create is called to get the id
    return record;
  }
}


//Export an instance of UsersRepository 
module.exports = new UsersRepository('users.json')