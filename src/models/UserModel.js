import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true
  },
  steamURL: {
    type: String,
    required: true
  },
  blizzardURL: { type: String }
})

export default mongoose.model('User', UserSchema)
