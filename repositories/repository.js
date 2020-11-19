const fs = require("fs");
const crypto = require("crypto");

module.exports = class Repository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }
    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }
  async create(attrs) {
    attrs.id = this.randomId();

    const records = await this.getAll();
    records.push(attr);
    await this.writeAll(records);

    return attrs;
  }
  //Open users.js, Read contents, Parse contents, Return parsed data
  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }
  //write the updated array back to this.filename
  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }
  //Generate random ID with crypto.randomBytes as string w/hex formatting
  randomID() {
    return crypto.randomBytes(4).toString("hex");
  }
  //Find user by ID
  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }
  //Delete a record by ID
  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }
  //Update a record
  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    //If no record exist
    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }
    //Assign everything to object
    Object.assign(record, attrs);
    await this.writeAll(records);
  }
  //Find a record
  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
};
