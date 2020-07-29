import React, { useState, useEffect } from "react";
import styles from "../style/Profile.module.css";

import { FcSettings } from "react-icons/fc";

import { Link } from "react-router-dom";
import { auth } from "../firebase/index";
import axios from "axios";

const url = "http://localhost:8080/api/profile";

const Profile = () => {
  const [icon, setIcon] = useState(""),
    [profile, setProfile] = useState(""),
    [activity, setActivity] = useState(""),
    [like, setLike] = useState(""),
    [sns, setSns] = useState(""),
    [gallery, setGallery] = useState("");

  const UserInfo = () => {
    //送信
    axios
      .get(url + "/" + auth.currentUser.uid) //パスパラメータにユーザーIDを追加
      .then((res) => {
        // alert(res.data.user_name);
        setIcon(res.data.icon);
        setProfile(res.data.profile);
        setActivity(res.data.activity);
        setLike(res.data.likes);
        setSns(res.data.sns);
        setGallery(res.data.gallery);
      })
      .catch((error) => {
        alert(error);
      });
  };

  useEffect(() => {
    UserInfo();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <p className={styles.profileTitle}>プロフィール</p>
        <Link
          to={{
            pathname: "/ProfileCreate",
            state: {
              beforeIcon: icon,
              beforeProfile: profile,
              beforeActivity: activity,
              beforeLike: like,
              beforeSns: sns,
              beforeGallery: gallery,
            },
          }}
        >
          <FcSettings className={styles.profileCreateButton} />
        </Link>
      </header>

      <div className={styles.main}>
        {/* <div className="my-3">{icon}</div> */}

        {/* <Image src={icon} height="140" width="140" roundedCircle /> */}
        <img src={icon} className={styles.avatar} />
        <div className={styles.mainContent}>
          <div className={styles.mainContentLeft}>
            <div className={styles.profileItem}>自己紹介</div>
            <div className={styles.profileItemValue}>{profile}</div>
            <div className={styles.profileItem}>活動</div>
            <div className={styles.profileItemValue}>{activity}</div>
            <div className={styles.profileItem}>趣味</div>
            <div className={styles.profileItemValue}>{like}</div>
            <div className={styles.profileItem}>SNS</div>
            <div className={styles.profileItemValue}>{sns}</div>
          </div>
          <div className={styles.mainContentRight}>
            <div className={styles.gallery}>ギャラリー</div>
            <div className={styles.galleryValue}>{gallery}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
