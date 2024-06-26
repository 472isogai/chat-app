// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/**
 * Config = 機密情報です！！！
 * この部分はGitHubに上げないこと！！！！！！！
 */
//
const firebaseConfig = {
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const dbRef = ref(database, "chat");

//オブジェクトの練習
// const kosuge = {
//   name:"こすげ",
//   age: 41,
//   from:"神奈川",
// }
// console.log(kosuge.name)
// console.log(kosuge["from"])

// 送信ボタンを押したときの処理
$("#send").on("click", function () {
  //入力欄のデータを取得
  const userName = $("#userName").val();
  const text = $("#text").val();
  console.log("12", userName, text);

  // 現在の日時を取得
  const timestamp = new Date();
  // 日時を適切なフォーマットに整形 //永野さんの書き方を拝借
  const formattedDate = timestamp.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  console.log("ちゃんとフォームの値取得できた？", userName, text);

  //送信データをオブジェクトにまとめる
  const message = {
    userName: userName,
    text: text,
    timestamp: formattedDate//*//
  };

  // Firebase Realtime Databaseにオブジェクト送信
  const newPostRef = push(dbRef);
  set(newPostRef, message);

  // 入力欄をクリア//*//
  $('#text').val('');

});


// 指定した場所にデータが追加されたことを検知
onChildAdded(dbRef, function (data) {
  // 追加されたデータをFirebaseから受け取り、分解
  // ルールにのっとった分解方法
  const message = data.val();
  const key = data.key;
  // console.log(data, message, key);

  let chatMsg = `
      <div class="chat">
        <div>${message.userName}</div> 
        <div>${message.text}</div> 
        <div>${message.timestamp}</div> 
      </div>
      <button class="delete" data-key="${key}">削除</button>
  `;

  $("#output").append(chatMsg);
});

$(document).on('click', '.delete', function () {
  const key = $(this).data('key'); // ボタンに設定したdata属性からキーを取得

  // データベースからエントリを削除
  remove(ref(database, `chat/${key}`));
  // 対応するHTML要素も削除
  $(this).closest('.chat').remove();
});

