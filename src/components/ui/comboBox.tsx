import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
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

const ComboBox = () => {
  const [selected, setSelected] = useState(filterOptions[0]);
  const [query, setQuery] = useState('');

  const filteredResult =
    query === ''
      ? filterOptions
      : filterOptions.filter((option: filterOptionType) =>
          option.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div className='fixed top-[15px] right-[20px] w-[150px]'>
      <Combobox value={selected} onChange={setSelected}>
        <div className='relative mt-1'>
          <div className='relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm'>
            <Combobox.Input
              className='w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0'
              displayValue={(option: filterOptionType) => option.name}
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
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute z- inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
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
  );
};

export default ComboBox;
