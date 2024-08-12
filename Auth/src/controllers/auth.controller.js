import { v4 as uuid } from "uuid";
import { handleResponse } from "../utils/handleResponse.utils.js";
import User from "../domains/entities/user.entity.js";
import Account from "../domains/entities/account.entity.js";
import { handleError } from "../utils/handleError.utils.js";
import RegisterResponses from "../domains/entities/models/responses/register.responses.js";
import bcrypt from "bcryptjs";
import VerifyResponse from "../domains/entities/models/responses/verify.response.js";
import jwt from "jsonwebtoken";
import LoginResponse from "../domains/entities/models/responses/login.response.js";
import ClientHistories from "../domains/entities/histories/client.histories.js";
import ForgotPasswordResponse from "../domains/entities/models/responses/forgotPassword.response.js";

function emailValidator(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.(com|co\.id)$/i;
  return emailPattern.test(email);
}

async function register(req, res) {
  const generatedVerificationCode = uuid().toString();
  try {
    const {
      first_name,
      last_name,
      username,
      password,
      password_confirmation,
      email,
      number_phone,
      gender,
    } = req.body;
    if (!emailValidator(email)) {
      return handleResponse(
        res,
        email,
        400,
        "Invalid Email Format. Email must contain '@' and a valid domain like '.com' or '.co.id'",
      );
    }

    if (password_confirmation !== password) {
      return handleResponse(
        res,
        password,
        400,
        "Confirm Passwords do not match with Passwords.",
      );
    }

    const userValidator = await User.findOne({
      where: { email: email },
    });

    if (userValidator) {
      return handleResponse(res, email, 400, "Account already exists");
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const newAccount = await Account.create({
      username: username,
      password: hash,
      verification_code: generatedVerificationCode,
      account_status: "UNVERIFIED",
    });

    await User.create({
      id: newAccount.id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      number_phone: number_phone,
      gender: gender,
    });

    const handlingResponse = new RegisterResponses(
      username,
      password,
      newAccount.verification_code,
      newAccount.account_status,
    );

    await ClientHistories.create({
      userId: newAccount.id,
      username: username,
      first_name: first_name,
      last_name: last_name,
      email: email,
      number_phone: number_phone,
      account_status: "UNVERIFIED",
      gender: gender,
      type: "REGISTER",
    });

    return handleResponse(
      res,
      handlingResponse,
      200,
      "Register is successfully",
    );
  } catch (err) {
    handleError(res, err);
  }
}

async function verifyAccount(req, res) {
  const { username, verification_code } = req.body;
  try {
    const account = await Account.findOne({
      where: {
        username: username,
        verification_code: verification_code,
      },
    });
    if (account == null) {
      return handleResponse(res, req.body, 401, "Account not found");
    }
    if (account.verification_code === verification_code) {
      await Account.update(
        {
          account_status: "VERIFIED",
          verification_code: null,
        },
        {
          where: {
            username: username,
          },
        },
      );

      await ClientHistories.create({
        userId: account.id,
        username: username,
        account_status: "VERIFIED",
        type: "VERIFY_ACCOUNT",
      });
      const handlingResponse = new VerifyResponse(
        account.id,
        account.username,
        "VERIFIED",
      );
      return handleResponse(
        res,
        handlingResponse,
        200,
        "Account successfully verified",
      );
    } else {
      return handleResponse(res, req.body, 400, "invalid verification code");
    }
  } catch (err) {
    handleError(res, err);
  }
}

async function login(req, res) {
  try {
    const account = await Account.findOne({
      where: {
        username: req.body.username,
      },
    });
    console.info(account.account_status);

    if (
      account.account_status === "VERIFIED" ||
      account.account_status === "LOGIN_FAILED_ONCE" ||
      account.account_status === "LOGIN_FAILED_TWICE"
    ) {
      const matching = await bcrypt.compare(
        req.body.password,
        account.password,
      );
      if (!matching) {
        let newStatus = "LOGIN_FAILED_ONCE";
        let message = "Wrong password";

        if (account.account_status === "LOGIN_FAILED_ONCE") {
          newStatus = "LOGIN_FAILED_TWICE";
        } else if (account.account_status === "LOGIN_FAILED_TWICE") {
          (newStatus = "ACCOUNT_BANNED"),
            (message = "Wrong password. Your account has been banned");
        }

        await Account.update(
          {
            account_status: newStatus,
          },
          {
            where: {
              username: account.username,
            },
          },
        );
        return handleResponse(res, null, 400, message);
      }

      const accountId = account.id;
      const accessToken = jwt.sign(
        { accountId },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "20s",
        },
      );
      const refreshToken = jwt.sign(
        { accountId },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        },
      );
      await Account.update(
        { refresh_token: refreshToken },
        {
          where: {
            id: accountId,
          },
        },
      );
      await User.findOne({
        where: {
          id: accountId,
        },
      });
      const handlingResponse = new LoginResponse(accountId, accessToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        // secure true is used when this serverapp go live (for https)
        // secure: true
      });
      handleResponse(res, handlingResponse, 200, "Login is successfully ");
    } else {
      return handleResponse(
        res,
        req.body.username,
        401,
        "Your account is not verified",
      );
    }
  } catch (error) {
    handleError(res, error);
  }
}

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null || token === "") {
    return handleResponse(res, null, 401, "Invalid Token");
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) {
      return handleError(res, err);
    }
    req.accountId = decode.accountId;
    // req.accountId ini bisa kita gunakan untuk API yang membutuhkan accountId tanpa perlu memasukkan accountId di body atau di param nya
    // console.info(req.accountId);
    next();
  });
}

const refreshAccessToken = async (req, res) => {
  const refreshedToken = req.cookies.refreshToken;

  if (!refreshedToken) {
    return handleResponse(res, null, 401, "No refresh token provided");
  }

  try {
    jwt.verify(
      refreshedToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err) => {
        if (err) {
          return handleResponse(res, null, 403, "invalid refresh token");
        }

        const account = await Account.findOne({
          where: {
            refresh_token: refreshedToken,
          },
        });

        if (!account) {
          return handleResponse(res, null, 403, "Refresh token is not found");
        }

        const newAccessToken = jwt.sign(
          { accountId: account.id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "30m",
          },
        );

        handleResponse(res, newAccessToken, 200, "Access token refreshed");
      },
    );
  } catch (err) {
    handleError(res, err);
  }
};

const logout = async (req, res) => {
  const accountId = req.accountId;

  await Account.update(
    { refresh_token: null },
    {
      where: {
        id: accountId,
      },
    },
  );

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
  });

  return handleResponse(res, accountId, 200, "Logout is successfully ");
};

const forgotPassword = async (req, res) => {
  const emailUser = req.body.email;
  try {
    const user = await User.findOne({
      where: {
        email: emailUser,
      },
    });

    if (user == null || !user) {
      return handleResponse(res, emailUser, 401, "Email is not found");
    }
    const generatedVerificationCode = uuid().toString();
    const account = await Account.update(
      {
        verification_code: generatedVerificationCode,
        account_status: "UNVERIFIED",
      },
      {
        where: {
          id: user.id,
        },
      },
    );

    await ClientHistories.create({
      userId: user.id,
      account_status: "UNVERIFIED",
      type: "FORGOT_PASSWORD",
    });

    const handleResponseData = new ForgotPasswordResponse(
      account.id,
      emailUser,
      account.verification_code,
      account.account_status,
    );

    return handleResponse(
      res,
      handleResponseData,
      200,
      "Forgot password has successfully sent",
    );
  } catch (err) {
    return handleError(res, err);
  }
};

const getAll = async (req, res) => {
  try {
    const user = await User.findAll();
    console.info("ini buat cek data" + req.accountId);
    return handleResponse(res, user, 200, "User successfully retrieved");
  } catch (err) {
    return handleError(res, err);
  }
};
export {
  register,
  verifyAccount,
  login,
  verifyToken,
  refreshAccessToken,
  logout,
  forgotPassword,
  getAll,
};
