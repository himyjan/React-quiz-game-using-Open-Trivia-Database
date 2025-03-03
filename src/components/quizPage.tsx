import { useState, Fragment, useRef, useMemo } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Combobox, DialogTitle, DialogPanel, Transition, Dialog } from '@headlessui/react';
import { showNotification } from '@mantine/notifications';
import clsx from 'clsx';
import api from '../utils/api';
import RightWrongStatisticsChart from './ui/rightWrongStatisticsChart';
import { dataType } from 'src/types/apiDataType';
import { chartDataType } from 'src/types/chartDataType';
import { scoreBoardType } from 'src/types/scoreBoardType';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const filterOptions = [
  { id: 1, name: 'easy' },
  { id: 2, name: 'medium' },
  { id: 3, name: 'hard' },
  { id: 4, name: 'General Knowledge' },
  { id: 5, name: 'Entertainment: Books' },
  { id: 6, name: 'Entertainment: Film' },
  { id: 7, name: 'Entertainment: Music' },
  { id: 8, name: 'Entertainment: Musicals &amp; Theatres' },
  { id: 9, name: 'Entertainment: Television' },
  { id: 10, name: 'Entertainment: Video Games' },
  { id: 11, name: 'Entertainment: Board Games' },
  { id: 12, name: 'Science &amp; Nature' },
  { id: 13, name: 'Science: Computers' },
  { id: 14, name: 'Science: Mathematics' },
  { id: 15, name: 'Mythology' },
  { id: 16, name: 'Sports' },
  { id: 17, name: 'Geography' },
  { id: 18, name: 'History' },
  { id: 19, name: 'Politics' },
  { id: 20, name: 'Art' },
  { id: 21, name: 'Celebrities' },
  { id: 22, name: 'Animals' },
  { id: 23, name: 'Vehicles' },
  { id: 24, name: 'Entertainment: Comics' },
  { id: 25, name: 'Science: Gadgets' },
  { id: 26, name: 'Entertainment: Japanese Anime &amp; Manga' },
  { id: 27, name: 'Entertainment: Cartoon &amp; Animations' },
];

type filterOptionType = {
  id: number;
  name: string;
};

let chartData: chartDataType[] = [
  {
    label: 'right',
    data: [
      {
        primary: 'Ordinal Group 0',
        secondary: 0,
      },
    ],
  },
  {
    label: 'wrong',
    data: [
      {
        primary: 'Ordinal Group 0',
        secondary: 0,
      },
    ],
  },
];

const Quiz = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const isAnswered = useRef<boolean>(true);
  const [score, setScore] = useState<scoreBoardType>({});
  const [data, setData] = useState<dataType>({
    results: [
      {
        category: '',
        correct_answer: '',
        difficulty: '',
        incorrect_answers: [],
        question: '',
        type: '',
      },
    ],
  });
  const [selected, setSelected] = useState(filterOptions[0]);
  const [query, setQuery] = useState<string>('');

  const filteredResult =
    query === ''
      ? filterOptions
      : filterOptions.filter((option: filterOptionType) =>
          option.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  if (isOpen === true) {
    chartData = [
      {
        label: 'right',
        data: [
          {
            primary: selected.name,
            secondary: score.hasOwnProperty(selected.name)
              ? (score as any)[selected.name][0]
              : 0,
          },
        ],
      },
      {
        label: 'wrong',
        data: [
          {
            primary: selected.name,
            secondary: score.hasOwnProperty(selected.name)
              ? (score as any)[selected.name][1]
              : 0,
          },
        ],
      },
    ];
  }

  function closeModal() {
    setIsOpen(false);
    resetQuiz();
  }

  function openModal() {
    setIsOpen(true);
    resetQuiz();
  }

  function startQuiz() {
    setIsPlaying(true);
    getApiQuiz();
    isAnswered.current = false;
  }

  function stopQuiz() {
    resetQuiz();
  }

  function resetQuiz() {
    setIsPlaying(false);
    setKey((prevKey) => prevKey + 1);
    setData({
      results: [
        {
          category: '',
          correct_answer: '',
          difficulty: '',
          incorrect_answers: [],
          question: '',
          type: '',
        },
      ],
    });
    isAnswered.current = true;
  }

  function quizAnswerClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (isAnswered.current === true) return;
    if (isPlaying === true) {
      setIsPlaying(false);
      setTimeout(() => {
        setKey((prevKey) => prevKey + 1);
        getApiQuiz();
        setIsPlaying(true);
      }, 1500);
    }
    const theValue = e.currentTarget.value;
    const theText = e.currentTarget.textContent;
    const difficulty = data.results[0].difficulty;
    const category = data.results[0].category;
    if (theText === data.results[0].correct_answer) {
      showNotification({
        title: 'correct answer',
        message: `The, currect answer is ${data.results[0].correct_answer}`,
      });
      setScore((preScore: any) => {
        preScore.hasOwnProperty(difficulty)
          ? (preScore[difficulty][0] += 1)
          : (preScore[difficulty] = [1, 0]);
        preScore.hasOwnProperty(category)
          ? (preScore[category][0] += 1)
          : (preScore[category] = [1, 0]);
        return preScore;
      });
    } else {
      showNotification({
        title: 'wrong answer  ',
        message: `The, currect answer is ${data.results[0].correct_answer}`,
      });
      setScore((preScore: any) => {
        preScore.hasOwnProperty(difficulty)
          ? (preScore[difficulty][1] += 1)
          : (preScore[difficulty] = [0, 1]);
        preScore.hasOwnProperty(category)
          ? (preScore[category][1] += 1)
          : (preScore[category] = [0, 1]);
        return preScore;
      });
    }
    isAnswered.current = true;
  }

  async function getApiQuiz() {
    const results = await api.getQuiz();
    setData(results);
    isAnswered.current = false;
  }

  type renderTimeProps = {
    remainingTime: number;
  };

  const renderTime = ({ remainingTime }: renderTimeProps) => {
    if (remainingTime === 0) {
      return <div className='text-[24px] text-red-600'>Too lale...</div>;
    }

    return (
      <div className='flex flex-col justify-center text-lg text-black'>
        <div className='flex justify-center text-[20px]'>Remaining</div>
        <div className='flex justify-center text-[36px]'>{remainingTime}</div>
        <div className='flex justify-center text-[24px]'>seconds</div>
      </div>
    );
  };

  return (
    <div className='flex flex-col justify-center'>
      <div className='flex justify-center font-bold text-lg text-green-800'>
        Open Trivia API Quiz Game
      </div>
      <div className='flex justify-center mt-[3%]'>
        <CountdownCircleTimer
          key={key}
          isPlaying={isPlaying}
          duration={15}
          colors={['#004777', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[7, 5, 2, 0]}
          onComplete={() => {
            getApiQuiz();
            showNotification({
              title: 'time up',
              message: '',
            });
            setIsPlaying(true);
            // do your stuff here
            return { shouldRepeat: true, delay: 1.5 }; // repeat animation in 1.5 seconds
          }}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>

      <div className='flex justify-center my-[15px] text-2xl'>Question</div>
      <div className='flex max-w-[680px] justify-center text-[16px] text-yellow-800'>
        difficulty: {data.results[0].difficulty}
        <br />
        category: {data.results[0].category}
      </div>
      <div className='flex max-w-[680px] text-[24px] text-blue-800'>
        {data.results[0].question.replace(/&quot;/g, '"').replace(/&#039;/g, "'")}
      </div>

      {useMemo(() => showAnswer(data, quizAnswerClick), [data])}

      <div className='fixed flex top-0 left-0'>
        <button
          type='button'
          onClick={openModal}
          className='rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
        >
          Open statistics popup
        </button>
        <button
          type='button'
          onClick={startQuiz}
          className='rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
        >
          Start Quiz
        </button>
        <button
          type='button'
          onClick={stopQuiz}
          className='rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
        >
          Stop Quiz
        </button>
      </div>

      {scoreBarPopupModule()}
    </div>
  );

  function scoreBarPopupModule() {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <DialogTitle
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    Right/wrong answers chart
                  </DialogTitle>
                  <div className='mt-2  '>
                    <div className='fixed top-[15px] right-[20px] w-[150px]'>
                      <Combobox value={selected} onChange={setSelected as any}>
                        <div className='relative mt-1'>
                          <div className='relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm'>
                            <Combobox.Input
                              className='w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0'
                              displayValue={(option: filterOptionType) =>
                                option.name
                              }
                              onChange={(event) => setQuery(event.target.value)}
                            />
                            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
                              <ChevronUpDownIcon
                                className='h-5 w-5 text-gray-400'
                                aria-hidden='true'
                              />
                            </Combobox.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            leave='transition ease-in duration-100'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                            afterLeave={() => setQuery('')}
                          >
                            <Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                              {filteredResult.length === 0 && query !== '' ? (
                                <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>
                                  Nothing found.
                                </div>
                              ) : (
                                filteredResult.map((option) => (
                                  <Combobox.Option
                                    key={option.id}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active
                                          ? 'bg-teal-600 text-white'
                                          : 'text-gray-900'
                                      }`
                                    }
                                    value={option}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? 'font-medium'
                                              : 'font-normal'
                                          }`}
                                        >
                                          {option.name}
                                        </span>
                                        {selected ? (
                                          <span
                                            className={`absolute z- inset-y-0 left-0 flex items-center pl-3 ${
                                              active
                                                ? 'text-white'
                                                : 'text-teal-600'
                                            }`}
                                          >
                                            <CheckIcon
                                              className='h-5 w-5'
                                              aria-hidden='true'
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))
                              )}
                            </Combobox.Options>
                          </Transition>
                        </div>
                      </Combobox>
                    </div>
                    <RightWrongStatisticsChart data={chartData} />
                  </div>

                  <div className='mt-4'>
                    <button
                      type='button'
                      className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </DialogPanel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }
};

export default Quiz;

function showAnswer(
  data: dataType,
  quizAnswerClick: (e: React.MouseEvent<HTMLButtonElement>) => void
) {
  return [...data.results[0].incorrect_answers, data.results[0].correct_answer]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value) // suffle
    .map((answer) => (
      <button
        type='button'
        onClick={quizAnswerClick}
        value='this is the value'
        className='rounded-md bg-black bg-opacity-20 px-4 py-2 mt-[10px] text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
        key={answer}
      >
        {answer}
      </button>
    ));
}
