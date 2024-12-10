import Image from 'next/image';

import { AppProps } from './appDetails';

const AppCard = ({ title, artist, image }: AppProps) => {
  return (
    <div
      aria-label="Check out song on Spotify"
      className={
        'relative flex h-[130px] w-[200px] items-center justify-center overflow-hidden rounded-xl py-0 sm:h-[160px] sm:w-[230px] md:h-[190px] md:w-[270px] lg:h-[240px] lg:w-[360px]'
      }
    >
      <Image
        src={image}
        alt={title}
        className="items-stretch justify-center bg-center bg-cover rounded-xl h-[50px] w-[150px] py-0 sm:h-[50px] sm:w-[200px] md:h-[100px] md:w-[250px] lg:h-[150px] lg:w-[300px]"
      />
      <div className=" hidden h-[150%] w-full bg-gradient-to-t from-black to-transparent"></div>

      <div className="absolute hidden bottom-3 left-5">
        <p className="text-[14px] text-white">{artist}</p>
        <h4 className="text-[30px] text-white">{title}</h4>
      </div>
    </div>
  );
};

export default AppCard;
