import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import Quiz from './components/quizPage';

function App() {
  return (
    <>
      <div className='flex justify-center items-center'>
        <CountdownCircleTimer
          isPlaying
          duration={15}
          colors={['#004777', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[7, 5, 2, 0]}
          onComplete={() => {
            // do your stuff here
            return { shouldRepeat: true, delay: 1.5 }; // repeat animation in 1.5 seconds
          }}
        >
          {({ remainingTime }) => <div>{remainingTime}</div>}
        </CountdownCircleTimer>
        <Quiz />
      </div>
    </>
  );
}

export default App;
