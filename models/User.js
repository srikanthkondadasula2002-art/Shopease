import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true, maxlength: 80},
  email: {type: String, required: true, unique: true, lowercase: true, trim: true},
  passwordHash: {type: String, required: true, select: false},
  role: {type: String, enum: ["user", "admin"], default: "user"},
  wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}]
}, {timestamps: {createdAt: "createdAt", updatedAt: false}, versionKey: false});

userSchema.virtual("id").get(function () { return this._id.toString(); });
userSchema.set("toJSON", {virtuals: true, transform: (_, value) => { delete value._id; delete value.passwordHash; return value; }});

export default mongoose.model("User", userSchema);
