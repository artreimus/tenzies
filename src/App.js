import React from "react";
import Die from "./components/Die.js";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  function useWindowSize() {
    const [windowSize, setWindowSize] = React.useState({
      width: undefined,
      height: undefined,
    });
    React.useEffect(() => {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
  }

  const { width, height } = useWindowSize();

  function loadNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function newGame() {
    setDice(loadNewDice());
    setRollsTotal(0);
  }

  const [dice, setDice] = React.useState(loadNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [rollsTotal, setRollsTotal] = React.useState(0);

  const diceElements = dice.map((die, index) => (
    <Die
      key={dice.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  function holdDice(id) {
    setDice((prevDice) => {
      const newArray = [];
      prevDice.forEach((die) => {
        if (die.id === id) {
          die.isHeld = !die.isHeld;
        }
        newArray.push(die);
      });
      return newArray;
    });
    // Another way of changing the state is using the map function below:
    // setDice((prevDice) => {
    //   return prevDice.map((die) => {
    //     return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
    //   });
    // });
  }

  function generateNewDie() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
    };
  }

  function rollDice() {
    setDice((prevDice) => {
      return prevDice.map((die) => {
        return die.isHeld ? die : generateNewDie();
      });
    });
    setRollsTotal((prevRollsTotal) => prevRollsTotal + 1);
  }

  React.useEffect(() => {
    setTenzies(
      dice.every((die) => {
        return die.value === dice[0].value && die.isHeld;
      })
    );
    // This is the same as the code above:
    // const allHeld = dice.every((die) => die.isHeld);
    // const allSameValue = dice.every((die) => die.value === dice[0].value);
    // setTenzies(allHeld && allSameValue);
  }, [dice]);
  return (
    <main className="main">
      <h1 className="main__title">Tenzies</h1>
      <p className="main__text">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <h3 className="roll__counter">
        Roll{rollsTotal > 0 ? "s" : ""}: {rollsTotal}
      </h3>
      <div className="container__dice">{diceElements}</div>

      {tenzies ? (
        <button className="new__button button" onClick={newGame}>
          New Game
        </button>
      ) : (
        <button className="roll__button button" onClick={rollDice}>
          Roll
        </button>
      )}
      {tenzies && <Confetti width={width} height={height} />}
    </main>
  );
}
