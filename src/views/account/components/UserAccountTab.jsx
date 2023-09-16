/* eslint-disable indent */
import { ImageLoader } from "@/components/common";
import { ACCOUNT_EDIT } from "@/constants/routes";
import { displayDate } from "@/helpers/utils";
import PropType from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";

const UserProfile = (props) => {
  const profile = useSelector((state) => state.profile);

  return (
    <div className="user-profile">
      <div className="user-profile-block">
        <div className="user-profile-banner">
          <div className="user-profile-banner-wrapper">
            <ImageLoader
              alt="Banner"
              className="user-profile-banner-img"
              src={profile.banner}
            />
          </div>
          <div className="user-profile-avatar-wrapper">
            <ImageLoader
              alt="Avatar"
              className="user-profile-img"
              src={profile.avatar}
            />
          </div>
          <button
            className="button button-small user-profile-edit"
            onClick={() => props.history.push(ACCOUNT_EDIT)}
            type="button"
          >
            Edit Account
          </button>
        </div>
        <div className="user-profile-details">
          <h2 className="user-profile-name">{profile.fullname}</h2>
          <span>Email</span>
          <br />
          <h5>{profile.email}</h5>
          <span>Street</span>
          <br />
          {profile.street ? (
            <h5>{profile.street}</h5>
          ) : (
            <h5 className="text-subtle text-italic">Street not set</h5>
          )}
          <span>City</span>
          <br />
          {profile.city ? (
            <h5>{profile.city}</h5>
          ) : (
            <h5 className="text-subtle text-italic">City not set</h5>
          )}
          <span>Building</span>
          <br />
          {profile.building ? (
            <h5>{profile.building}</h5>
          ) : (
            <h5 className="text-subtle text-italic">Building not set</h5>
          )}
          <span>Floor Number</span>
          <br />
          {profile.floor ? (
            <h5>{profile.floor}</h5>
          ) : (
            <h5 className="text-subtle text-italic">Floor Number not set</h5>
          )}
          <span>Nearby</span>
          <br />
          {profile.nearby ? (
            <h5>{profile.nearby}</h5>
          ) : (
            <h5 className="text-subtle text-italic">Nearby not set</h5>
          )}
          <span>Mobile</span>
          <br />
          {profile.mobile ? (
            <h5>{profile.mobile.value}</h5>
          ) : (
            <h5 className="text-subtle text-italic">Mobile not set</h5>
          )}
          <span>Date Joined</span>
          <br />
          {profile.dateJoined ? (
            <h5>{displayDate(profile.dateJoined)}</h5>
          ) : (
            <h5 className="text-subtle text-italic">Not available</h5>
          )}
        </div>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  history: PropType.shape({
    push: PropType.func,
  }).isRequired,
};

export default withRouter(UserProfile);
