import { useEffect, useState } from "react";
import { doc, increment, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import logo from "./logo.svg";
import flower1 from "./images/flower_1.svg";
import flower2 from "./images/flower_2.svg";
import flower3 from "./images/flower_3.svg";
import flower4 from "./images/flower_4.svg";
import flower5 from "./images/flower_5.svg";
import level1 from "./images/level_1.svg";
import level2 from "./images/level_2.svg";
import level3 from "./images/level_3.svg";
import level4 from "./images/level_4.svg";
import clearFlower from "./images/clear.svg";
import instaIcon from "./images/insta.svg";
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
    options: ["Sejong", "Jeongjo", "Gojong", "Sunjong"],
    flower: "Jeongjo",
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
      "Paper Nori",
      "Janggeum Workshop",
    ],
    flower: "Paper Nori",
    story: (
      <>
        Paper Nori brings the warmth of hanji paper
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
const flowerGoal = 400;
const resultFlowers = [flower1, flower2, flower3, flower4, flower5];
const levelFlowers = [level1, level2, level3, level4];
const flowerRotations = [
  "rotate(-159.088deg)",
  "rotate(128.469deg)",
  "rotate(116.731deg)",
  "rotate(-33.534deg)",
  "rotate(81.781deg)",
];
const lightOffsets = [
  ["-126px", "-34px", "0ms"],
  ["-88px", "-92px", "90ms"],
  ["-22px", "-118px", "180ms"],
  ["54px", "-104px", "270ms"],
  ["126px", "-50px", "360ms"],
  ["112px", "32px", "450ms"],
  ["46px", "68px", "540ms"],
  ["-78px", "48px", "630ms"],
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
  const isBloomed = totalCorrect >= flowerGoal;
  const flowerLevel = Math.min(
    Math.floor(totalCorrect / (flowerGoal / 4)) + 1,
    4,
  );

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
              xmlns="http://www.w3.org/2000/svg"
              width="226"
              height="158"
              viewBox="0 0 226 158"
              fill="none"
            >
              <path
                d="M146.09 114.065C148.003 113.782 149.815 113.388 151.584 113.73C144.172 117.22 133.12 119.204 127.34 116.484C124.153 114.98 123.664 112.086 125.767 109.094C127.741 106.284 130.898 103.985 134.206 101.739L125.743 102.585L113.505 103.992C103.484 110.466 92.1118 115.013 79.939 117.452C65.9609 120.25 52.1025 120.602 39.5798 118.527C27.4657 116.523 14.8099 111.181 12.7101 102.135C11.5953 97.3204 14.6993 92.07 20.6856 88.209C27.8624 83.5757 37.0229 81.2332 45.5414 81.1697C54.9136 81.0948 63.1439 83.694 68.4531 88.2671C69.4154 89.0985 69.9969 89.9488 69.882 91.3204C68.2815 90.9267 67.1354 90.3711 65.854 89.7585C62.0131 87.9308 57.9423 86.4478 53.1937 85.6557C45.6776 84.3915 36.4105 84.9707 28.8857 88.857C23.0426 91.8742 20.1283 96.5952 21.359 100.805C22.161 103.57 23.945 105.812 26.5884 107.736C37.033 115.336 56.0137 117.425 72.99 115.411C84.0957 114.089 96.9641 110.472 106.159 104.209C84.8204 104.556 72.8366 94.0895 70.6106 80.0556C68.7468 68.2868 72.3702 53.8185 82.5994 42.023C87.8459 35.9806 95.9792 30.0338 105.335 29.0878C110.877 28.5291 115.261 30.2659 116.632 33.7313C118.429 38.5223 114.932 44.08 109.923 48.5487C120.914 50.8882 129.178 56.0507 133.505 63.3253C134.591 60.1975 136.031 57.4536 138.248 54.6125C144.594 46.6319 155.85 40.5109 167.729 38.8635C176.949 37.587 184.835 39.9418 188.174 45.2649C193.461 53.6893 187.773 65.2236 179.057 74.2962C170.342 83.3688 157.767 91.1558 145.22 98.8686L152.226 99.7862C161.099 100.38 170.499 98.3252 178.929 94.0502L189.673 88.0106L198.808 82.9158C201.806 81.2467 205.109 80.075 208.507 79.1587C215.119 77.3828 221.999 78.1641 223.257 82.2995C223.513 83.1297 222.52 83.9947 221.574 84.2533C220.165 84.644 219.565 84.0074 219.181 83.1951C218.54 81.8811 216.451 81.3751 214.378 81.3024C209.115 81.1291 202.362 84.0323 197.579 86.8326L188.753 92.0069C184.255 94.6425 179.836 97.0455 174.821 99.0408C165.168 102.893 155.017 104.15 145.87 102.721L140.397 101.977L136.092 104.914C134.285 106.139 132.696 107.582 131.522 109.061C129.823 111.184 130.585 113.271 133.11 114.048C136.876 115.198 141.325 114.801 146.103 114.105L146.09 114.065ZM112.87 95.1741C112.949 96.6832 113.392 97.8498 114.208 99.1865C120.117 95.1302 125.064 90.4067 127.947 85.093C135.3 71.4902 126.701 59.0817 112.067 53.375C108.116 51.8441 103.932 50.9216 99.4229 50.1433L96.8271 49.4103C96.4063 49.2991 96.2057 48.5395 96.4601 48.2201C97.6743 46.7614 103.577 47.4823 106.704 47.8655C109.291 44.2092 110.957 40.5084 109.187 37.2207C107.768 34.5806 103.741 33.7303 99.3975 35.1242C91.352 37.7034 85.2448 45.4241 82.0768 51.1214C76.4425 61.2482 74.727 71.6563 77.0209 81.1131C79.9754 93.3123 91.4278 101.292 109.64 100.507C109.85 98.7887 109.679 97.5817 108.48 96.5276C103.583 96.6686 99.7878 94.9909 97.8648 92.079C94.2186 86.5222 98.9616 78.1926 104.112 71.8401L112.374 77.0474C114.273 78.247 116.037 79.4445 117.332 81.0277C120.759 85.2175 119.467 91.1686 112.87 95.1741ZM139.588 98.3162L150.324 91.4902C154.877 88.5967 159.01 85.6468 163.112 82.4327C172.446 74.8777 180.536 65.7902 181.909 56.7253C182.414 53.4041 181.83 50.3642 179.754 47.8281C176.494 43.8499 169.936 42.3671 162.592 43.8975C152.722 45.955 144.316 52.1064 139.862 58.8134C137.901 61.7729 136.544 64.6774 135.436 67.7352C138.853 78.6529 133.07 90.3151 119.574 99.9088L123.9 99.5496C129.221 98.8181 134.296 98.3266 139.6 98.3015L139.588 98.3162ZM114.412 83.6038C113.369 82.1839 111.998 81.0075 110.36 79.9464L104.812 76.3449C100.389 82.7139 98.0803 90.1616 104.721 93.8203C106.319 94.6967 108.353 95.3511 110.696 95.045C115.697 92.1885 116.575 86.9674 114.412 83.6038Z"
                fill="#FD728A"
              />
              <path
                d="M117.386 122.794C113.086 131.469 101.622 129.122 91.8828 127.897L76.4921 125.951C65.2663 124.538 34.5869 123.483 21.5354 135.228C19.692 136.881 18.3406 139.094 18.6623 140.955C19.0088 142.951 17.4543 144.777 14.639 145.35C7.60549 146.796 8.14127 135.995 17.5605 129.477C33.3123 118.585 57.3335 119.251 70.2451 120.516C76.7623 121.158 82.411 122.143 87.8353 123.056L101.977 125.42C104.919 125.915 107.606 125.744 110.191 125.133C113.737 124.314 116.307 121.637 117.604 117.667L118.076 117.237C118.404 116.938 118.884 119.747 117.38 122.774L117.386 122.794Z"
                fill="#FD728A"
              />
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
          <section className={`intro-copy ${isBloomed ? "is-bloomed" : ""}`}>
            <h1>
              {isBloomed ? (
                isEnglish ? (
                  "The peony is in full bloom!"
                ) : (
                  "모란꽃이 활짝 피었습니다!"
                )
              ) : isEnglish ? (
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
              {isBloomed ? (
                isEnglish ? (
                  <>
                    Together, {flowerGoal} lights brought the peony of
                    Haenggung-dong
                    <br />
                    into full bloom. Thank you for being part of it!
                  </>
                ) : (
                  <>
                    함께 모은 {flowerGoal}개의 빛으로 행궁동의 모란꽃이
                    피었습니다.
                    <br />
                    함께해주셔서 감사합니다!
                  </>
                )
              ) : isEnglish ? (
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
            {isBloomed && (
              <img
                className="intro-bloomed-art"
                src={clearFlower}
                alt={isEnglish ? "The completed peony flower" : "완성된 모란꽃"}
              />
            )}
            <button
              className="text-action"
              onClick={() => setScreen("question")}
            >
              {isBloomed
                ? isEnglish
                  ? "Take the quiz"
                  : "퀴즈 풀기"
                : isEnglish
                  ? "Start the flower trail"
                  : "꽃길 시작하기"}{" "}
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
                  ? "Correct!"
                  : "정답!"
                : isEnglish
                  ? "The correct answer is..."
                  : "정답은..."}
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
          <section
            className={`complete-content ${isBloomed ? "is-bloomed" : ""}`}
          >
            <h1>
              {isBloomed
                ? isEnglish
                  ? "The peony is in full bloom!"
                  : "모란꽃이 활짝 피었습니다!"
                : isEnglish
                  ? `You’ve collected ${sessionCorrect} lights`
                  : `빛 ${sessionCorrect}조각을 모았습니다`}
            </h1>
            <p>
              {isBloomed ? (
                isEnglish ? (
                  <>
                    Together, {flowerGoal} lights brought the peony of
                    Haenggung-dong
                    <br />
                    into full bloom. Thank you for being part of it!
                    <br />
                    You added {sessionCorrect} lights to the journey.
                  </>
                ) : (
                  <>
                    함께 모은 {flowerGoal}개의 빛으로 행궁동의 모란꽃이
                    피었습니다.
                    <br />
                    함께해주셔서 감사합니다!
                    <br />
                    이번 여정에서 빛 {sessionCorrect}개를 모았어요.
                  </>
                )
              ) : isEnglish ? (
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
            <div
              className={`complete-flower ${isBloomed ? "complete-flower-bloomed" : ""}`}
              aria-hidden="true"
            >
              <img
                className="complete-flower-art"
                src={isBloomed ? clearFlower : levelFlowers[flowerLevel - 1]}
                alt=""
              />
              {!isBloomed &&
                lightOffsets.map(([x, y, delay]) => (
                  <span
                    key={`${x}-${y}`}
                    className="light-particle"
                    style={{
                      "--light-x": x,
                      "--light-y": y,
                      "--light-delay": delay,
                    }}
                  />
                ))}
            </div>
            <p className="complete-links-label">
              {isEnglish ? "Links" : "링크"}
            </p>
            <a
              className="text-action instagram-link"
              href="https://www.instagram.com/rokhus.kr?stkn=MXB4dTAwZTM2bGM1cQ=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="instagram-icon"
                src={instaIcon}
                alt=""
                aria-hidden="true"
              />
              <span>
                {isEnglish ? "Visit Rokhus Instagram" : "로쿠스 인스타그램"}
              </span>
            </a>
            <a
              className="text-action instagram-link"
              href="https://www.instagram.com/papernori?stkn=NnNodmYybmh3dWhs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="instagram-icon"
                src={instaIcon}
                alt=""
                aria-hidden="true"
              />
              <span>
                {isEnglish
                  ? "Visit Paper Nori’s Instagram"
                  : "종이노리 인스타그램"}
              </span>
            </a>
          </section>
        </>
      )}
    </main>
  );
}

export default App;
