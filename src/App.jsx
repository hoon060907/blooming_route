import { useEffect, useState } from "react";
import { doc, increment, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import logo from "./logo.svg";
import flower1 from "./images/flower_1.svg";
import flower2 from "./images/flower_2.svg";
import flower3 from "./images/flower_3.svg";
import flower4 from "./images/flower_4.svg";
import flower5 from "./images/flower_5.svg";
import clearFlower from "./images/clear.svg";
import "./App.css";

const quiz = [
  {
    title: "수원의 빛",
    prompt: "수원 화정을 축성하고\n새로운 도시를 세운 왕은 누구일까요?",
    options: ["세종", "정조", "고종", "순종"],
    answer: 1,
    flower: "정조",
    story: (
      <>
        정조가 꿈꿨던 새로운 수원,
        <br />
        오늘의 행궁동도 사람들의 발걸음으로
        <br />
        다시 피어납니다.
      </>
    ),
    type: "blossom",
  },
  {
    title: "행궁의 빛",
    prompt: "“행궁”은 어떤 곳을 뜻할까요?",
    options: [
      "왕이 여행/능행차 중 머물던 임시 궁궐",
      "왕실의 보물을 보관하던 창고",
      "군사 훈련만을 위해 만든 공간",
      "백성의 물건을 사고 팔던 시장",
    ],
    answer: 0,
    flower: "왕이 여행/능행차 중 머물던 임시 궁궐",
    story: (
      <>
        화성행궁은 정조가 수원을 찾을 때<br />
        머물던 곳으로, 수원화성과 함께
        <br />이 도시의 중요한 이야기를 품고 있습니다.
        <br />
        <br />
        오늘의 행궁동은 그 역사 곁에서
        <br />
        사람들의 일상과 공방의 손끝,
        <br />
        새로운 가게들의 이야기가 함께
        <br />
        이어지는 골목입니다.
      </>
    ),
    type: "fourpetal",
  },
  {
    title: "공방의 빛",
    prompt: (
      <>
        행궁동의 공방 중,
        <br />
        종이꽃을 만드는 공방의 이름은 무엇일까요?
      </>
    ),
    options: ["메리골드", "나녕공방", "종이노리", "장금이공방"],
    answer: 2,
    flower: "종이노리",
    story: (
      <>
        종이노리는 한지의 따뜻한 결을
        <br />
        손끝으로 느끼며,
        <br />
        종이 한 장을 꽃으로 접고 빛을 더해
        <br />
        나만의 이야기를 만들어 가는
        <br />
        행궁동의 공방입니다.
      </>
    ),
    type: "paper",
  },
  {
    title: "꽃등불의 빛",
    prompt: "행궁꽃등불에 피어있는 꽃은 무엇일까요?",
    options: ["벚꽃", "연꽃", "국화", "모란"],
    answer: 3,
    flower: "모란",
    story: (
      <>
        모란은 풍요와 번영을 상징합니다.
        <br />
        한지 모란등의 빛은 행궁동 공방거리에도
        <br />
        새로운 활기가 피어나기를
        <br />
        바라는 마음입니다.
      </>
    ),
    type: "tulip",
  },
  {
    title: "로쿠스의 빛",
    prompt: "로쿠스(ROKHUS)는 어떤 팀인가요?",
    options: [
      "지역 공방의 손기술과 이야기를 상품과 콘텐츠로 만드는 로컬 비즈니스 팀",
      "행궁동의 건물을 설계하는 건축 팀",
      "전통 유물을 보관하는 박물관 팀",
      "수원 지역의 교통을 관리하는 팀",
    ],
    answer: 0,
    flower:
      "지역 공방의 손기술과 이야기를\n상품과 콘텐츠로 만드는 로컬 비즈니스 팀",
    story: (
      <>
        로쿠스는 지역 공방의 손기술에
        <br />
        새로운 이야기를 더하는 팀입니다.
        <br />
        <br />
        공방에 가진 고유한 기술과 자원을
        <br />
        사람들이 직접 경험하고 선택하고
        <br />
        오래 기억할 수 있는
        <br />
        상품과 콘텐츠로 기록합니다.
      </>
    ),
    type: "daisy",
  },
];

const englishQuiz = [
  {
    title: "The Light of Suwon",
    prompt: "Who built Hwaseong Fortress and founded a new city?",
    options: ["Sejong", "King Jeongjo", "Gojong", "Sunjong"],
    flower: "King Jeongjo",
    story: (
      <>
        King Jeongjo dreamed of a new Suwon.
        <br />
        Today, the footsteps of visitors bring
        <br />
        new life to Haenggung-dong.
      </>
    ),
  },
  {
    title: "The Light of Haenggung",
    prompt: "What does “haenggung” mean?",
    options: [
      "A temporary palace where the king stayed while traveling",
      "A storehouse for royal treasures",
      "A space built only for military training",
      "A market where people bought and sold goods",
    ],
    flower: "A temporary palace for the king",
    story: (
      <>
        Hwaseong Haenggung was where King Jeongjo stayed
        <br />
        when he visited Suwon. Together with Hwaseong Fortress,
        <br />
        it holds an important part of this city’s story.
        <br />
        <br />
        Today, workshops, shops, and everyday moments
        <br />
        keep Haenggung-dong’s story growing.
      </>
    ),
  },
  {
    title: "The Light of the Workshop",
    prompt: "Which local workshop makes flowers from paper?",
    options: [
      "Marigold",
      "Nayeong Workshop",
      "Jongi Nori",
      "Janggeum Workshop",
    ],
    flower: "Jongi Nori",
    story: (
      <>
        Jongi Nori brings the warmth of hanji paper
        <br />
        to your fingertips.
        <br />
        With a sheet of paper and a little light,
        <br />
        you can fold a flower and make it your own.
        <br />A special workshop in Haenggung-dong.
      </>
    ),
  },
  {
    title: "The Light of the Flower Lantern",
    prompt: "Which flower appears on the Haenggung flower lantern?",
    options: ["Cherry blossom", "Lotus", "Chrysanthemum", "Peony"],
    flower: "Peony",
    story: (
      <>
        The peony symbolizes prosperity and abundance.
        <br />
        Its hanji lantern carries a wish for new energy
        <br />
        to bloom along Haenggung-dong’s workshop streets.
      </>
    ),
  },
  {
    title: "The Light of ROKHUS",
    prompt: "What kind of team is ROKHUS?",
    options: [
      "A local business team that turns workshop skills and stories into products and content",
      "An architecture team that designs buildings in Haenggung-dong",
      "A museum team that preserves traditional artifacts",
      "A team that manages transportation in Suwon",
    ],
    flower:
      "A local business team sharing workshop skills and stories through products and content",
    story: (
      <>
        ROKHUS adds new stories to the skills of local workshops.
        <br />
        <br />
        We help people experience and choose each workshop’s
        <br />
        unique craft and resources, then preserve them as
        <br />
        products and content people can remember.
      </>
    ),
  },
];

const counterRef = doc(db, "stats", "bloomingRoute");
const flowerGoal = 100;
const resultFlowers = [flower1, flower2, flower3, flower4, flower5];
const flowerRotations = [
  "rotate(-159.088deg)",
  "rotate(128.469deg)",
  "rotate(116.731deg)",
  "rotate(-33.534deg)",
  "rotate(81.781deg)",
];

function Brand({ subtle = false }) {
  return (
    <div
      className={`brand ${subtle ? "brand-subtle" : ""}`}
      aria-label="Rokhus"
    >
      <img src={logo} alt="" />
      <span>ROKHUS</span>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("splash");
  const [language, setLanguage] = useState("ko");
  const [question, setQuestion] = useState(0);
  const [selected, setSelected] = useState(null);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [answerError, setAnswerError] = useState("");
  const current = quiz[question];
  const currentCopy = language === "en" ? englishQuiz[question] : current;
  const isEnglish = language === "en";

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(
    () =>
      onSnapshot(counterRef, (snapshot) => {
        const count = snapshot.exists() ? snapshot.data().count : 0;
        setTotalCorrect(typeof count === "number" ? count : 0);
      }),
    [],
  );

  async function choose(index) {
    if (savingAnswer) return;
    setSelected(index);
    setAnswerError("");
    if (index === current.answer) {
      setSavingAnswer(true);
      try {
        await setDoc(counterRef, { count: increment(1) }, { merge: true });
        setSessionCorrect((count) => count + 1);
      } catch (error) {
        console.error("Could not save the correct answer to Firestore.", error);
        setAnswerError(true);
        setSavingAnswer(false);
        return;
      }
      setSavingAnswer(false);
    }
    setScreen("result");
  }

  function advance() {
    if (question === quiz.length - 1) setScreen("complete");
    else {
      setQuestion((n) => n + 1);
      setSelected(null);
      setScreen("question");
    }
  }

  function restart() {
    setQuestion(0);
    setSelected(null);
    setSessionCorrect(0);
    setScreen("splash");
  }

  return (
    <main className={`app-shell screen-${screen}`}>
      <button
        className="language-toggle"
        type="button"
        onClick={() => setLanguage((value) => (value === "ko" ? "en" : "ko"))}
        aria-label={isEnglish ? "Switch to Korean" : "영어로 전환"}
        aria-pressed={isEnglish}
      >
        {isEnglish ? "한국어" : "EN"}
      </button>
      {screen === "splash" && (
        <button
          className="splash-screen screen-button"
          onClick={() => setScreen("intro")}
          aria-label={isEnglish ? "Start" : "시작하기"}
        >
          <Brand subtle />
          <div className="splash-center">
            <svg
              className="splash-mark"
              viewBox="0 0 226 158"
              aria-hidden="true"
            >
              <path d="M146 114c13-2 21-1 27 0-8 4-20 7-28 5-5-2-5-5-2-10 2-3 5-5 9-8l-9 1-13 2c-11 7-23 11-36 14-15 3-30 3-43 1-13-2-26-8-28-17-1-5 2-11 9-15 8-5 17-7 27-7 10 0 19 3 24 8 1 1 2 2 2 3-2 0-3-1-4-2-4-2-8-4-13-5-8-1-18 0-26 4-6 3-9 8-8 12 1 3 3 5 6 7 11 8 31 9 49 7 12-1 25-5 35-11-23 0-36-11-38-26-2-13 2-28 13-41 6-7 14-13 24-14 6-1 11 1 12 5 2 5-2 11-8 16 12 2 21 8 25 15 1-3 3-7 5-10 7-9 19-15 31-17 10-1 19 1 22 7 6 9 0 21-9 31s-23 18-37 26l8 1c10 1 20-2 29-6l11-6 10-5c3-2 7-3 10-4 7-2 14-1 15 3 0 1-1 2-2 2s-2-1-2-2c-1-1-3-2-5-2-6 0-13 3-18 6l-9 5c-5 3-10 5-15 7-10 4-21 5-31 3l-6-1-5 3c-2 1-4 3-5 5-2 2-1 4 2 5 4 1 8 1 13 0ZM113 95c0 2 1 3 2 4 6-4 11-9 14-14 8-14-1-27-16-33-4-2-8-3-13-4l-3-1c-1 0-1-1 0-2 1-1 7 0 10 0 3-4 5-8 3-11-1-3-5-4-10-2-8 3-15 11-18 17-6 10-8 21-5 31 3 13 15 21 34 20 0-2 0-3-1-4-5 0-9-2-11-5-4-6 1-15 6-22l9 5c2 1 4 3 5 4 4 5 2 11-5 16Zm27 3 11-7c5-3 9-6 13-9 10-8 18-17 19-26 1-3 0-7-2-9-3-4-10-5-18-4-10 2-19 8-23 15-2 3-3 6-4 9 4 11-2 23-16 33l5 0c6-1 11-2 17-2ZM114 84c-1-1-2-3-4-4l-6-4c-5 6-7 14 0 18 2 1 4 2 6 2 5-3 6-8 4-12Z" />
              <path d="M117 123c-5 9-16 6-26 5l-16-2c-12-1-43-2-56 10-2 2-3 4-3 6 1 2-1 4-4 5-7 1-6-10 3-16 16-11 40-10 53-9 7 1 13 2 18 3l14 2c3 1 6 0 9 0 4-1 6-4 8-8l1 0c0 1 0 3-1 4Z" />
            </svg>
            <div className="app-title">BLOOMING ROUTE</div>
            <div className="touch">
              {isEnglish ? "Tap the screen to begin" : "화면을 터치해주세요"}
            </div>
          </div>
        </button>
      )}

      {screen === "intro" && (
        <>
          <Brand subtle />
          <section className="intro-copy">
            <h1>
              {isEnglish ? (
                <>
                  Help the flowers of <em>Haenggung-dong</em> bloom
                </>
              ) : (
                <>
                  행궁동의 <em>꽃</em>을 피워주세요
                </>
              )}
            </h1>
            <p>
              {isEnglish ? (
                <>
                  {totalCorrect} lights have been collected so far.
                  <br />
                  {Math.max(flowerGoal - totalCorrect, 0)} more are needed for
                  the peony lantern to bloom.
                  <br />
                  Your participation will help it bloom.
                </>
              ) : (
                <>
                  지금까지 {totalCorrect}개의 빛이 모였습니다.
                  <br />
                  모란꽃이 피려면 {Math.max(flowerGoal - totalCorrect, 0)}개의
                  빛이 더 필요합니다.
                  <br />
                  당신의 참여가 꽃을 완성할 수 있어요.
                </>
              )}
            </p>
            <button
              className="text-action"
              onClick={() => setScreen("question")}
            >
              {isEnglish ? "Start the flower trail" : "꽃길 시작하기"}{" "}
              <span>→</span>
            </button>
          </section>
        </>
      )}

      {screen === "question" && (
        <>
          <Brand subtle />
          <section className="question-content">
            <h1>{currentCopy.title}</h1>
            <p className="question-prompt">{currentCopy.prompt}</p>
            <div className="answers">
              {currentCopy.options.map((option, index) => (
                <button
                  className="answer"
                  key={option}
                  onClick={() => choose(index)}
                  disabled={savingAnswer}
                >
                  <span className="answer-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </button>
              ))}
            </div>
            {savingAnswer && (
              <p className="counter-message" role="status">
                {isEnglish ? "Saving your light…" : "빛을 기록하고 있어요…"}
              </p>
            )}
            {answerError && (
              <p className="counter-error" role="alert">
                {isEnglish
                  ? "Could not save your light. Check your connection and try again."
                  : "빛을 저장하지 못했어요. 연결을 확인하고 다시 선택해주세요."}
              </p>
            )}
          </section>
        </>
      )}

      {screen === "result" && (
        <button
          className="result-screen screen-button"
          onClick={advance}
          aria-label={isEnglish ? "Continue" : "다음으로"}
        >
          <img
            className="result-flower-art"
            src={resultFlowers[question]}
            alt=""
          />
          <div className="result-heading">
            <h1>
              {selected === current.answer
                ? isEnglish
                  ? "Correct"
                  : "정답"
                : isEnglish
                  ? "The correct answer"
                  : "정답"}
            </h1>
            <div className="result-letter">
              {String.fromCharCode(65 + current.answer)}
            </div>
            <div className="result-flower">{currentCopy.flower}</div>
          </div>
          <p className="result-story">{currentCopy.story}</p>
          <span className="next-hint">
            {isEnglish ? "Tap to continue" : "화면을 터치해 계속하기"}{" "}
            <span>→</span>
          </span>
          <img
            className="result-flower-background"
            src={resultFlowers[question]}
            style={{ transform: flowerRotations[question] }}
            alt=""
            aria-hidden="true"
          />
        </button>
      )}

      {screen === "complete" && (
        <>
          <Brand subtle />
          <section className="complete-content">
            <h1>
              {isEnglish
                ? `You’ve collected ${sessionCorrect} lights`
                : `빛 ${sessionCorrect}조각을 모았습니다`}
            </h1>
            <p>
              {isEnglish ? (
                <>
                  {totalCorrect} lights collected so far
                  <br />
                  {Math.max(flowerGoal - totalCorrect, 0)} more until the peony
                  lantern blooms
                </>
              ) : (
                <>
                  지금까지 {totalCorrect}개 빛이 모였어요
                  <br />
                  이제 모란꽃등불이 피기까지
                  <br />
                  {Math.max(flowerGoal - totalCorrect, 0)}개의 빛이 남았습니다.
                </>
              )}
            </p>
            <div className="complete-flower" aria-hidden="true">
              <img className="complete-flower-art" src={clearFlower} alt="" />
            </div>
            <button className="text-action" onClick={restart}>
              {isEnglish ? "Back to the beginning" : "메인으로 돌아가기"}
            </button>
          </section>
        </>
      )}
    </main>
  );
}

export default App;
