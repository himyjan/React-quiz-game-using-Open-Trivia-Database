import { useState, useEffect, Fragment } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Dialog, Transition } from '@headlessui/react';
import { Group, Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import clsx from 'clsx';
import api from '../utils/api';
import RightWrongStatisticsChart from './ui/rightWrongStatisticsChart';

type dataType = {
  results: dataResultsType[];
};

type dataResultsType = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
};

const Quiz = () => {
  let [isOpen, setIsOpen] = useState(false);
  let [right, setRight] = useState(0);
  let [data, setData] = useState<dataType>({
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

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  async function getApiQuiz() {
    const results = await api.getQuiz();
    setData(results);
  }

  // useEffect(() => {
  //   getApiQuiz();
  // }, []);

  return (
    <div className='flex flex-col'>
      <div className='flex justify-center mt-[3%]'>
        <CountdownCircleTimer
          isPlaying
          duration={15}
          colors={['#004777', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[7, 5, 2, 0]}
          onComplete={() => {
            getApiQuiz();
            showNotification({
              title: 'Default notification',
              message: 'Hey there, your code is awesome! 🤥',
            });
            // do your stuff here
            return { shouldRepeat: true, delay: 1.5 }; // repeat animation in 1.5 seconds
          }}
        >
          {({ remainingTime }) => <div>{remainingTime}</div>}
        </CountdownCircleTimer>
      </div>

      <div className='flex justify-center my-[15px]'>Question</div>
      <div className='flex max-w-[680px] text-[24px] text-blue-800'>
        {data.results[0].question}
      </div>

      <button
        type='button'
        onClick={openModal}
        className='rounded-md bg-black bg-opacity-20 px-4 py-2 mt-[10px] text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
      >
        {data.results[0].incorrect_answers[0]}
      </button>
      <button
        type='button'
        onClick={openModal}
        className='rounded-md bg-black bg-opacity-20 px-4 py-2 mt-[10px] text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
      >
        {data.results[0].incorrect_answers[1]}
      </button>
      <button
        type='button'
        onClick={openModal}
        className='rounded-md bg-black bg-opacity-20 px-4 py-2 mt-[10px] text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
      >
        {data.results[0].incorrect_answers[2]}
      </button>

      <div className='fixed top-0 left-0 inset-0'>
        <button
          type='button'
          onClick={openModal}
          className='rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
        >
          Open statistics chart
        </button>
      </div>
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
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className={clsx(
                      'text-lg font-medium leading-6 text-gray-900'
                    )}
                  >
                    Payment successful
                  </Dialog.Title>
                  <div className='mt-2'>
                    <RightWrongStatisticsChart />
                    <p className='text-sm text-gray-500'>
                      Your payment has been successfully submitted. We’ve sent
                      you an email with all of the details of your order.
                    </p>
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Quiz;
