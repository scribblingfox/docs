import { Dialog, Menu, Transition } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/outline";
import lunr, { Index } from "lunr";
import { Fragment, useRef, useState } from "react";

import SEARCH_RESULTS from "../../public/search-results.json";
import SearchResult from "./SearchResult";
import type { SearchableItem } from "./types";

const SEARCH_DATA: SearchableItem[] = SEARCH_RESULTS;

type Props = {
  setSearchOpen: (arg0: boolean) => void;
  searchOpen: boolean;
};

export default function Search(props: Props) {
  const [results, setResults] = useState<Index.Result[]>([]);

  const search = async (e: any) => {
    const { value } = e.currentTarget;

    if (value === "") {
      setResults([]);
      return;
    }

    const index = lunr(function () {
      this.ref("path");
      this.field("text");
      this.field("title");
      this.metadataWhitelist = ["position"];

      SEARCH_DATA.forEach(function (this: any, doc) {
        this.add(doc);
      }, this);
    });

    const results = index.search(value);
    setResults(results);
  };

  const handleClick = async () => {
    props.setSearchOpen(true);
  };

  const searchInputRef = useRef(null);

  return (
    <>
      <div
        onClick={handleClick}
        className="flex mx-2 px-2 py-1 border-2 rounded-lg border-gray-400 font-weight-bold text-gray-300 bg-gray-700 text-sm font-semibold cursor-pointer items-center"
      >
        <SearchIcon className="h-5 w-4 mr-2" aria-hidden="true" />
        <div className="flex-1">Search</div>
        <div className="font-mono bg-gray-500 rounded text-gray-100 px-1.5 text-xs">
          /
        </div>
      </div>

      <Transition appear show={props.searchOpen || false} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => props.setSearchOpen(false)}
          initialFocus={searchInputRef}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-2xl p-3 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <input
                  type="text"
                  className="focus:outline-none w-full shadow-sm sm:text-lg border-gray-300 rounded-lg px-3 border focus:border-blue-300"
                  placeholder="Search Buttondown's documentation"
                  onChange={search}
                  ref={searchInputRef}
                />
                {results.length > 0 && (
                  <Menu>
                    <div className="pt-2 focus:border-none border-none ring-transparent">
                      <Menu.Items static>
                        {results.map((result: Index.Result, i) => (
                          <SearchResult result={result} key={i} />
                        ))}
                      </Menu.Items>
                    </div>
                  </Menu>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
