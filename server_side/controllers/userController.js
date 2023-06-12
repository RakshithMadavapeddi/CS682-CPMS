const User = require('../models/users');
const {createTokenForOneHour} = require('../services/authentication');
const {sendEmail} = require("../services/sendMail");

// Create a new user
exports.createUser = async (req, res) => {
  const {name, email, password, role} = req.body;
  const {returning} = req.query; 

  if (!name || !email || !password || !role) {
    return res.status(400).json({message: "Missing username, email, or password, role"});
  }

  
  const userExists = await User.findOne({email: email});
  if (userExists) {
    return res.status(409).json({message: "User already exists"});
  }

  try {
    if (role === "CLIENT" ) {
      sendEmail(email, "Your CPMS Account created",
      name, email, password
      );
    }
  } catch (err) {
    return res.status(400).json({message: "email doesnt exist"});
  }



  try {
    const user = new User({ name :name, email: email, password: password , role:role});
    await user.save();
    
    if (returning === 'true') {
      return res.status(200).json(user);
    } 
    return res.status(200).json({message: "Successfully created user"});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

// checking login correctly 
exports.checkLogin = async (req, res) => {
  const {email, password} = req.body;
  
  if (!email || !password) {
    return res.status(400).json({error: "Username or password missing"});
  }

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password); 

    if (!token) {
      return res.status(401).json({message: "Wrong credentials"});
    }

    return res.cookie("token", token).status(200).json({message:"Log in successful"});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

exports.deleteUserByEmail = async (req, res) => {
  const payload = req.user;
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: "Email to be deleted not provided" });
  }

  if (payload && payload.role !== "ADMIN") {
    return res.status(401).json({ error: "User not authorized" });
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (payload.email === user.email) {
      return res.status(409).json({ error: "Admin cannot delete own account" });
    }

    await User.findOneAndDelete({ email: email });
    return res.status(200).json({ message: "Successfully deleted user" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { name, password, role } = req.body;
  const currentUserEmail = req.params.email;

  try {
    let user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only allow the user to update their own name and password
    if (email === currentUserEmail) {
      const updateFields = {};
      if (name) updateFields.name = name;
      if (password) updateFields.password = password;

      await User.updateOne({ email: email }, updateFields);
    }

    // Allow admin to update any user's name and role
    if (req.user.role === "ADMIN") {
      const updateFields = {};
      if (name) updateFields.name = name;
      if (role) updateFields.role = role;

      await User.updateOne({ email: email }, updateFields);
    }

    return res.status(200).json({ message: "Successfully updated user" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  const payload = req.user;
  const {role} = req.query;

  if (!payload || payload.role !== "ADMIN") {
    return res.status(401).json({ error: "User not authorized" });
  }

  try {
    if (role) {
      const users = await User.find({role: role}, '-password');
      return res.status(200).json(users);
    } else {
      const users = await User.find({}, '-password');
      return res.status(200).json(users);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getUserByEmail = async (req, res) => {
  const requestingUser = req.user;
  const { email } = req.params;

  if (requestingUser.role !== "ADMIN") {
    return res.status(401).json({ error: "User not authorized" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const {email} = req.body;
  if (!email) {
    return res.status(400).json({error: "Missing email"});
  }
  try {
    const user = await User.findOne({email: email});
    if (!user) {
      return res.status(404).json({error: "User doesnt exist"});
    }
    const token = createTokenForOneHour(user);
    await sendEmail(email, "Reset Password Link", user.name, user.email, token, 2);
    return res.status(200).json({message: "email sent successfully"});
  } catch (err) {
    return res.status(500).json({error: "internal server error"});
  }
}
