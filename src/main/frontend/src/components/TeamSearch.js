import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import Select from "react-select";

// material-uiの読み込み
import { AppBar, Toolbar, Button, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

// CSSの読み込み
import styles from "../style/TeamSearch.module.css";

// 他ファイルからコンポーネントの読み込み
import {
  SportName,
  Prefectures,
  ActivityFrequency,
  DayOfTheWeek,
} from "../data/data";
import { TeamSearchCard } from "./TeamSearchCard";

// データベースとの通信
const url = "http://localhost:8080/api/search";

// searchResultDataを入れておくための変数
let searchResultDataBox = "";

// useReducerと連動。
const reducer = (state, action) => {
  switch (action.type) {
    case "reducerUpdate":
      return {
        ...state,
        currentPage: 1,
        sum: searchResultDataBox.length, //データ総件数
        per: 10, //1ページあたりの表示件数
        pageAmount: Math.ceil(searchResultDataBox.length / 10), //ページの総数
        resourceData: searchResultDataBox.slice(0, 10), //ページに表示するデータ（配列型式）
      };
    // 前へページを押した時に実行される
    case "viewPreview":
      return {
        ...state,
        currentPage: state.currentPage - 1,
        resourceData: action.data, //表示するデータを書く
      };
    case "viewNext":
      return {
        ...state,
        currentPage: state.currentPage + 1,
        resourceData: action.data, //表示するデータを書く
      };
    default:
  }
};

const TeamSearch = () => {
  // ユーザーが検索のために選択した値を管理するstate
  const [freeWord, setFreeWord] = useState(""), //フリーワードstate
    [searchResultData, setSearchResultData] = useState([]); //検索結果を管理するためのstate

  const [state, dispatch] = useReducer(reducer, {
    currentPage: 1, //現在のページ
    sum: searchResultData.length, //データ総件数
    per: 10, //1ページあたりの表示件数
    pageAmount: Math.ceil(searchResultData.length / 10), //ページの総数
    resourceData: searchResultData, //ページに表示するデータ（配列型式）
  });

  useEffect(() => {
    searchResultDataBox = searchResultData;
    return dispatch({ type: "reducerUpdate" });
  }, [searchResultData]);

  // 検索ボタンを押した時に実行される処理
  const TeamSearchBtn = () => {
    //フリーワード文字数チェック
    if (freeWord.length === 1) {
      alert("フリーワード検索は2文字以上のキーワードで検索してください");
    } else if (freeWord.match(/ + |　+/)) {
      //空白(半角全角)を含む場合処理判定なし
      alert("フリーワード検索は空白(半角全角)を含めることができません");
    } else {
      SearchInfo();
      window.scrollTo(0, 0);
    }
  };

  // 検索結果を表示するデータを切り出してくれる処理。
  const sliceData = (offset, per) => {
    return searchResultData.slice(offset, offset + per);
  };

  // 検索機能の記述
  const SearchInfo = () => {
    axios
      .get(url, {
        params: {
          sportName: document.getElementsByName("sport_name")[0].value, //sportName,
          prefectures: document.getElementsByName("prefectures_name")[0].value,
          activityFrequency: document.getElementsByName(
            "activity_frequency_name"
          )[0].value,
          dayOfTheWeek: document.getElementsByName("day_of_the_week_name")[0]
            .value,
          freeWord: freeWord,
        },
      })
      //get(エンドポイント, { params: {送りたいパラメーターの指定}　}
      .then((res) => {
        //取得データ全てをリスト化表示
        setSearchResultData(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const freeWordChange = (e) => {
    setFreeWord(e.target.value);
  };

  // 前へボタンを押すと実行される処理
  const viewPreview = () => {
    window.scrollTo(0, 0);
    const offset = (state.currentPage - 2) * state.per;
    return dispatch({
      type: "viewPreview",
      data: sliceData(offset, state.per),
    });
  };

  // 次へボタンを押すと実行される処理
  const viewNext = () => {
    window.scrollTo(0, 0);
    const offset = state.currentPage * state.per;
    return dispatch({
      type: "viewNext",
      data: sliceData(offset, state.per),
    });
  };

  return (
    <div>
      <AppBar color="default" position="sticky">
        <Toolbar>
          <Select
            className={styles.select}
            isClearable
            options={SportName}
            placeholder="スポーツ名"
            name="sport_name"
          />
          <Select
            className={styles.select}
            isClearable
            options={Prefectures}
            placeholder="活動地域"
            name="prefectures_name"
          />
          <Select
            className={styles.select}
            isClearable
            options={ActivityFrequency}
            placeholder="活動頻度"
            name="activity_frequency_name"
          />
          <Select
            className={styles.select}
            isClearable
            options={DayOfTheWeek}
            placeholder="活動曜日"
            name="day_of_the_week_name"
          />
          <TextField
            className="freeWordBox"
            size="small"
            label="フリーワード"
            variant="standard"
            name=""
            value={freeWord}
            onChange={freeWordChange}
          />
          <Button color="inherit" onClick={TeamSearchBtn}>
            <SearchIcon />
          </Button>
        </Toolbar>
      </AppBar>
      <div>
        {/*　DBから取得した値を1つずつ取り出して、map以下の処理を個数分行う。 */}
        {state.resourceData.length > 0 ? (
          state.resourceData.map((data) => (
            <TeamSearchCard
              team_id={data.teamId}
              team_name={data.teamName}
              picture={data.picture}
              sport_name={data.sportName}
              prefectures={data.prefectures}
              activity_frequency={data.activityFrequency}
              day_of_the_week={data.dayOfTheWeek}
              team_concept={data.teamConcept}
            />
          ))
        ) : (
          <p className={styles.searchResultNone}>検索結果は0件でした。</p>
        )}
      </div>

      <div className={styles.pageNationActuion}>
        <Button
          variant="contained"
          onClick={viewPreview}
          disabled={state.currentPage === 1}
        >
          前へ
        </Button>
        <span className={styles.pageNationInfo}>
          {state.currentPage}/{state.pageAmount}
        </span>
        <Button
          variant="contained"
          onClick={viewNext}
          disabled={
            state.currentPage === state.pageAmount || state.pageAmount === 0
          }
        >
          次へ
        </Button>
      </div>
    </div>
  );
};

export default TeamSearch;
