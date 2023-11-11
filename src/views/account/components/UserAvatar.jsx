/* eslint-disable indent */
import {
  DownOutlined,
  LoadingOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ACCOUNT, SIGNIN, SIGNUP } from "@/constants/routes";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { signOut } from "@/redux/actions/authActions";

const UserNav = ({ isSigned = true }) => {
  const { profile, isAuthenticating } = useSelector((state) => ({
    profile: state.profile,
    isAuthenticating: state.app.isAuthenticating,
  }));
  const userNav = useRef(null);
  const dispatch = useDispatch();

  const toggleDropdown = (e) => {
    const closest = e.target.closest("div.user-nav");

    try {
      if (!closest && userNav.current.classList.contains("user-sub-open")) {
        userNav.current.classList.remove("user-sub-open");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    document.addEventListener("click", toggleDropdown);

    return () => document.removeEventListener("click", toggleDropdown);
  }, []);

  const onClickNav = () => {
    userNav.current.classList.toggle("user-sub-open");
  };

  return isAuthenticating ? (
    <div className="user-nav">
      &nbsp;
      <LoadingOutlined />
    </div>
  ) : (
    <div
      className="user-nav"
      onClick={onClickNav}
      onKeyDown={() => {}}
      ref={userNav}
      role="button"
      tabIndex={0}
    >
      <h5 className="text-overflow-ellipsis">
        {profile.fullname && profile.fullname.split(" ")[0]}
      </h5>
      <div className="user-nav-img-wrapper">
        {isSigned ? (
          <img alt="" className="user-nav-img" src={profile.avatar} />
        ) : (
          <svg
            width="22px"
            height="22px"
            viewBox="0 0 24 24"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <g stroke="none" stroke-width="1" fill="none" fill-rule="">
              <path
                d="M3,18.25 C3,15.763979 7.54216175,14.2499656 12.0281078,14.2499656 C16.5140539,14.2499656 21,15.7636604 21,18.25 C21,19.9075597 21,20.907554 21,21.2499827 L3,21.2499827 C3,20.9073416 3,19.9073474 3,18.25 Z"
                stroke="currentColor"
                stroke-width="1.5"
              ></path>
              <circle
                stroke="currentColor"
                stroke-width="1.5"
                cx="12"
                cy="7"
                r="4.25"
              ></circle>
            </g>
          </svg>
        )}
      </div>
      <DownOutlined style={{ fontSize: "1.2rem" }} />

      <div className="user-nav-sub">
        {isSigned ? (
          <>
            {profile.role !== "ADMIN" && (
              <Link to={ACCOUNT} className="user-nav-sub-link">
                View Account
                <UserOutlined />
              </Link>
            )}
            <h6
              className="user-nav-sub-link margin-0 d-flex"
              onClick={() => dispatch(signOut())}
              role="presentation"
            >
              Sign Out
              <LogoutOutlined />
            </h6>{" "}
          </>
        ) : (
          <>
            <Link
              className="user-nav-sub-link margin-0 d-flex"
              to={SIGNIN}
              role="presentation"
            >
              Log in
            </Link>
            <Link
              className="user-nav-sub-link margin-0 d-flex"
              to={SIGNUP}
              role="presentation"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

UserNav.propType = {
  profile: PropTypes.object.isRequired,
};

export default withRouter(UserNav);
