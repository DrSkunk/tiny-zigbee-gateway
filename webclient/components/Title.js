import { SunIcon, MoonIcon } from '@heroicons/react/solid';

export default function Title() {
  return (
    <h1 className="font-thin text-3xl sm:text-4xl md:text-6xl bg-clip-text pb-4 text-transparent mb-4 drop-shadow-md bg-gradient-to-r from-yellow-500 to-red-500  text-center ">
      <SunIcon className="inline-block text-yellow-500 w-6 h-6 sm:w-8 sm:h-8 md:w-14 md:h-14" />
      Tiny Zigbee Gateway
      <MoonIcon className="inline-block text-red-500 w-6 h-6 sm:w-8 sm:h-8 md:w-14 md:h-14" />
    </h1>
  );
}
