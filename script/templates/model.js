const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const validator = require('validator'); // https://www.npmjs.com/package/validator
const ObjectId = mongoose.Schema.Types.ObjectId;

/* ------------------------------------------------------- */

const modelName = '$MODEL';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

/* ------------------------------------------------------- */
schema.plugin(mongoosePaginate);
module.exports = mongoose.model(modelName, schema);
