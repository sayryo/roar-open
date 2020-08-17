import React, { useEffect, useState } from "react";

import { auth, db } from "../firebase/index";
import axios from "axios";

//propsにhistoryを渡すため
import { withRouter } from "react-router-dom";

import styles from "../style/TeamDetails.module.css";
import { Button } from "@material-ui/core";

import { GiJapan, GiRunningShoe } from "react-icons/gi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { DiCodeigniter } from "react-icons/di";
import { Spinner } from "../UIkit";

const TeamDetails = (props) => {
  const url = "http://localhost:8080/api/usersTeams";
  const uid = auth.currentUser.uid;

  const [teamIdList, setTeamIdList] = useState([]);
  let teamId = []; // ユーザーが所属しているチームのIDを入れる箱

  //ユーザーが既に参加しているチームのチームIDを全て取得し、配列型で格納し、stateのteamIdListをそのデータに更新する関数。
  const getUsersTeamsId = async () => {
    await axios
      .get(url + "/" + uid) //ユーザーが既に参加しているチームのチームIDを取得
      .then((res) => {
        const resData = res.data;
        //res.dataは[0:{id:"値" , uid:"値" , teamId:"値" , teamName:"値" },1:{},2:{}.....]で返ってくる。
        //dataのオブジェクト１つ１つから、teamIdを取り出し、変数teamIdに配列で格納する。
        resData.map((data) => {
          teamId = teamId.concat(data.teamId);
        });
        //stateのTeamIdListを更新。
        setTeamIdList(teamId);
      })
      .catch((error) => {
        alert(error);
      });
  };

  //初回レンダリング時に実行される。
  useEffect(() => {
    getUsersTeamsId();
  }, []);

  // 1桁の数字を0埋めで2桁にする
  let toDoubleDigits = function (num) {
    num += "";
    if (num.length === 1) {
      num = "0" + num;
    }
    return num;
  };

  //現在時刻取得
  const date = new Date();
  const customDate =
    toDoubleDigits(date.getFullYear()) +
    "年" +
    toDoubleDigits(date.getMonth() + 1) +
    "月" +
    toDoubleDigits(date.getDate()) +
    "日" +
    toDoubleDigits(date.getHours()) +
    ":" +
    toDoubleDigits(date.getMinutes()) +
    ":" +
    toDoubleDigits(date.getSeconds());

  //firebaseDBへ参加時間を登録
  const sendTime = async () => {
    await db
      .collection("chatExitTime")
      .doc(props.team_id + "_" + uid)
      .set({
        exitTime: customDate,
      })
      .then(function () {
        console.log("Document successfully written!");
        props.history.push("/Chat");
      })
      .catch(function (error) {
        alert("参加登録エラー　Error writing document：" + error);
      });
  };
  //参加ボタン
  const handleSubmit = async () => {
    //送信
    await axios
      .post(url, {
        uid: uid,
        teamId: props.team_id,
        teamName: props.team_name,
      })
      .then(() => {
        props.history.push("/Chat");
      })
      .catch((error) => {
        alert("参加登録エラー" + error);
      });

    await sendTime();
  };

  return (
    <div className={styles.container}>
      <div className={styles.team_details_title}>チーム詳細</div>
      <div className={styles.team_details_main}>
        <p className={styles.team_name}>{props.team_name}</p>
        <img
          className={styles.teamPicture}
          src={props.picture}
          alt="チーム画像"
        />
        <p className={styles.team_info_title}>基本プロフィール</p>
        <div className={styles.team_info_container}>
          <div className={styles.team_info_card}>
            <div
              className={`${styles.team_info_card_title} ${styles.sport_name_background_color}`}
            >
              <GiRunningShoe className={styles.team_info_card_icon} />
              スポーツ
            </div>
            <div className={styles.team_info_card_body}>
              <p className={styles.team_info_card_value}>{props.sport_name}</p>
            </div>
          </div>
          <div className={styles.team_info_card}>
            <div
              className={`${styles.team_info_card_title} ${styles.prefectures_background_color}`}
            >
              <GiJapan className={styles.team_info_card_icon} />
              活動地域
            </div>
            <div className={styles.team_info_card_body}>
              <p className={styles.team_info_card_value}>{props.prefectures}</p>
            </div>
          </div>
          <div className={styles.team_info_card}>
            <div
              className={`${styles.team_info_card_title} ${styles.activity_frequency_background_color}`}
            >
              <DiCodeigniter className={styles.team_info_card_icon} />
              活動頻度
            </div>
            <div className={styles.team_info_card_body}>
              <p className={styles.team_info_card_value}>
                {props.activity_frequency}
              </p>
            </div>
          </div>
          <div className={styles.team_info_card}>
            <div
              className={`${styles.team_info_card_title} ${styles.day_of_the_week_background_color}`}
            >
              <FaRegCalendarAlt className={styles.team_info_card_icon} />
              活動曜日
            </div>
            <div className={styles.team_info_card_body}>
              <p className={styles.team_info_card_value}>
                {props.day_of_the_week}
              </p>
            </div>
          </div>
        </div>
        <p className={styles.team_info_title}>チームコンセプト</p>
        <p className={styles.team_concept}>{props.team_concept}</p>
        {/* 詳細を表示しているチームに、ユーザーが所属していなかった場合 */}
        {teamIdList.indexOf(String(props.team_id)) == -1 && (
          <div className={styles.join_btn}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {props.team_name}に参加する
            </Button>
          </div>
        )}
        {/* 詳細を表示しているチームに、ユーザーが所属していた場合 */}
        {teamIdList.indexOf(String(props.team_id)) > 0 && (
          <div className={styles.join_btn}>
            あなたはこのチームのメンバーです
          </div>
        )}
      </div>
    </div>
  );
};

export default withRouter(TeamDetails);
