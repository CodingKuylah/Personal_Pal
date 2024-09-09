import { v4 as uuid } from "uuid";
import User from "../domains/entities/user.entity.js";
import Account from "../domains/entities/account.entity.js";
import RegisterResponses from "../domains/entities/models/responses/register.responses.js";
import bcrypt from "bcryptjs";
import VerifyResponse from "../domains/entities/models/responses/verify.response.js";
import jwt from "jsonwebtoken";
import LoginResponse from "../domains/entities/models/responses/login.response.js";
import ClientHistories from "../domains/entities/histories/client.histories.js";
import ForgotPasswordResponse from "../domains/entities/models/responses/forgotPassword.response.js";
import { handleFailedResponse } from "../utils/response-handling/failed-response/handle.failed-response.js";
import { handleSuccessResponse } from "../utils/response-handling/success-response/handle.success-response.js";
import { handleErrorResponse } from "../utils/response-handling/error-response/handle.error-response.js";

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
      return handleFailedResponse(
        res,
        "Invalid Email Format. Email must contain '@' and a valid domain like '.com' or '.co.id'",
        400,
      );
    }

    if (password_confirmation !== password) {
      return handleFailedResponse(
        res,
        "Confirm Passwords do not match with Passwords.",
        400,
      );
    }

    const userValidator = await User.findOne({
      where: { email: email },
    });

    if (userValidator) {
      return handleFailedResponse(res, "Account already exists", 400);
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

    return handleSuccessResponse(
      res,
      handlingResponse,
      200,
      "Register is successfully",
    );
  } catch (err) {
    handleErrorResponse(res, err);
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
      return handleFailedResponse(res, "Account not found", 401);
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
      return handleSuccessResponse(
        res,
        handlingResponse,
        200,
        "Account successfully verified",
      );
    } else {
      return handleFailedResponse(res, "invalid verification code", 400);
    }
  } catch (err) {
    handleErrorResponse(res, err);
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
        return handleFailedResponse(res, message, 400);
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
      handleSuccessResponse(
        res,
        handlingResponse,
        200,
        "Login is successfully ",
      );
    } else {
      return handleFailedResponse(res, "Your account is not verified", 401);
    }
  } catch (error) {
    handleFailedResponse(res, error);
  }
}

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null || token === "") {
    return handleFailedResponse(res, "Invalid Token", 401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) {
      return handleErrorResponse(res, err);
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
    return handleFailedResponse(res, "No refresh token provided", 401);
  }

  try {
    jwt.verify(
      refreshedToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err) => {
        if (err) {
          return handleFailedResponse(res, "invalid refresh token", 403);
        }

        const account = await Account.findOne({
          where: {
            refresh_token: refreshedToken,
          },
        });

        if (!account) {
          return handleFailedResponse(res, "Refresh token is not found", 403);
        }

        const newAccessToken = jwt.sign(
          { accountId: account.id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "30m",
          },
        );

        return handleSuccessResponse(
          res,
          newAccessToken,
          200,
          "Access token refreshed",
        );
      },
    );
  } catch (err) {
    handleErrorResponse(res, err);
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

  return handleSuccessResponse(res, accountId, 200, "Logout is successfully ");
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
      return handleFailedResponse(res, "Email is not found", 401);
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

    return handleSuccessResponse(
      res,
      handleResponseData,
      200,
      "Forgot password has successfully sent",
    );
  } catch (err) {
    return handleErrorResponse(res, err);
  }
};

const getAll = async (req, res) => {
  try {
    const user = await User.findAll();
    console.info("ini buat cek data" + req.accountId);
    return handleSuccessResponse(res, user, 200, "User successfully retrieved");
  } catch (err) {
    return handleErrorResponse(res, err);
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
